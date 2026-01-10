import crypto from 'crypto';
import { Contest } from '../models/contest.model.js';


// ====== create contest ===========

const createContest = async (req, res) => {

    try {
        const { roomName, maxUsers, contestTime } = req.body;
        const ownerId = req.user.id;

        if (!roomName || !maxUsers || !contestTime) {
            return res
                .status(400)
                .json({
                    success: true,
                    message: "All fields are required",
                });
        }

        const roomCode = crypto.randomBytes(4).toString("hex");

        const contest = new Contest({
            roomName,
            roomCode,
            ownerId: req.user._id,
            maxUsers,
            contestTime,
            participants: [{ userId: ownerId }],
            status: "waiting",
        })

        await contest.save();

        return res
            .status(201)
            .json({
                success: true,
                contest,
            });
    } catch (error) {
        console.error("CREATE CONTEST ERROR:", error);

        return res
            .status(500)
            .json({
                success: false,
                message: "Server error",
            });
    }
}

// =========== Create room & generate invite link

const generateLink = async (req, res) => {

    try {

        const ownerId = req.user.id;

        const contest = await Contest.findOne({
            ownerId: ownerId,
            status: "waiting",
        })

        if (!contest) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No active contest found",
                })
        }

        //Create invite link
        const inviteLink = `${process.env.FRONTEND_URL}/join/${contest.roomCode}`;

        return res
            .status(200)
            .json({
                success: true,
                message: "Link generate successfully",
                inviteLink,
            });

    } catch (error) {
        console.error("GENERATE LINK ERROR", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to generate link",
            })
    }
}

// ======== return existing link return ===========

const getExistingLink = async (req, res) => {

    try {
        const ownerId = req.user.id;

        const contest = await Contest.findOne({
            ownerId,
            status: "waiting",
        });

        if (!contest) {
            return res
            .status(404)
            .json({
                success: false,
                message: "No active contest",
            });
        }

        const inviteLink = `${process.env.FRONTEND_URL}/join/${contest.roomCode}`;

        return res
        .status(200)
        .json({
            success: true,
            inviteLink,
            roomCode: contest.roomCode,
        });
    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: "Server error",
        });
    }
};

const verifyRoom = async (req, res) => {

    const { roomCode } = req.params;

    try {
        const contest = await Contest.findOne({ roomCode });

        if (!contest) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Room not found",
                });
        }

        if (contest.status !== "waiting") {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Contest already started",
                });
        }

        if (contest.participants.length >= contest.maxUsers) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Room is Full",
                })
        }

        return res
            .status(200)
            .json({
                success: true,
                message: "Yes room is exist",
                roomCode,
                availablesSlots: contest.maxUsers - contest.participants.length,
            })

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Server error",
            })
    }
}

/**
 * Join contest room
 * - User must be logged in
 * - Room must be waiting
 * - Room must not be full
 * - User cannot join twice
 */

const joinRoom = async (req, res) => {

    try {
        const { roomCode } = req.params;
        const userId = req.user.id;

        console.log("ROOM CODE IS", roomCode);
        console.log("USER ID IS ", userId);

        const contest = await Contest.findOne({ roomCode });

        //Room exist check

        if (!contest) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Room not found",
                });
        }

        // status check
        if (contest.status !== "waiting") {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Contest already started",
                });
        }

        //Room full check
        if (contest.participants.length >= contest.maxUsers) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Room is full",
                });
        }

        //Duplicate join check
        const alreadyJoined = contest.participants.some(
            (p) => p.userId.toString() === userId
        );

        if (alreadyJoined) {
            return res
                .status(200)
                .json({
                    success: true,
                    message: "Already joined",
                });
        }

        contest.participants.push({ userId });

        await contest.save();

        return res
            .status(200)
            .json({
                success: true,
                message: "Joined room sucessfully",
            });

    } catch (error) {
        console.error("JOIN ROOM ERROR", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Server error",
            })
    }
}


// ============= waitingRoom ==================

const waitingRoom = async (req, res) => {

    try {
        const { roomCode } = req.params;
        const userId = req.user.id;

        const contest = await Contest.findOne({ roomCode })
            .populate("ownerId", "fullname")
            .populate("participants.userId", "fullname");

        if (!contest) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Room not found",
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                roomName: contest.roomName,
                contestTime: contest.contestTime,
                maxUsers: contest.maxUsers,
                owner: contest.ownerId,
                participants: contest.participants.map(p => p.userId),
                isOwner: contest.ownerId._id.toString() === userId,
            });

    } catch (error) {
        console.error("WAITING ROOM ERROR", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Server error",
            })
    }

}

// ======= contest start ============
const startContest = async (req, res) => {

    const { roomCode } = rq.params;
    const userId = req.user.id;

    const contest = await Contest.findOne({ roomCode });

    if (!contest) {
        return res
            .status(404)
            .json({
                success: false,
                message: "not found contest"
            })
    }

    if (contest.ownerId.toString() !== userId) {

        return res
            .status(403)
            .json({
                success: false,
                message: "Only owner can start contest",
            });
    }

    contest.status = "running";
    await contest.save();

    return res.status(200)
        .json({
            success: true,
            message: "Contest started",
        })
}

export {
    createContest,
    generateLink,
    getExistingLink,
    verifyRoom,
    joinRoom,
    waitingRoom,
    startContest,
}