import express from 'express'
import http from 'http';
import { Server } from 'socket.io'
import userRouter from './routes/user.routes.js'
import judgeRoutes from "./routes/judge.routes.js";
import contestRouter from './routes/contest.routes.js'
import cors from 'cors'
import connectDB from './db/index.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import './cron/contestCleanup.cron.js'
import { verifySocketJWT } from './utils/socketAuth.js';
import { Contest } from './models/contest.model.js';

dotenv.config()

const app = express();
const port = process.env.PORT || 8000;

app.use(cookieParser())

/* ===========================
   MIDDLEWARES
=========================== */

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

//data body sa aa raha hu allow karo
app.use(express.json());
//data url sa aa raha hu allow karo
app.use(express.urlencoded({ extended: true }))


/* ===========================
   ROUTES
=========================== */
app.use("/coding/contest/user", userRouter);
app.use("/coding/contest/user", contestRouter);
app.use("/api/judge", judgeRoutes);


/* ===========================
   HTTP SERVER (IMPORTANT)
=========================== */

const server = http.createServer(app);

/* ===========================
     SOCKET.IO SETUP
=========================== */

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
})

io.use(verifySocketJWT);
// Room ka latest satae sabko bhene ka liya
const emitRoomState = async (io, roomCode) => {

    const contest = await Contest.findOne({ roomCode })
        .populate("ownerId", "fullname")
        .populate("participants.userId", "fullname");

    if (!contest) {
        return;
    }
    io.to(roomCode).emit("room-update", {
        roomName: contest.roomName,
        contestTime: contest.contestTime,
        maxUsers: contest.maxUsers,
        joinedUsers: contest.participants.length,
        owner: {
            id: contest.ownerId._id,
            name: contest.ownerId.fullname,
        },
        participants: contest.participants.map((p, index) => ({
            id: p.userId._id,
            name: p.userId.fullname,
            sno: index + 1,
        }))
    })
}


/* ===========================
   SOCKET EVENTS
=========================== */

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    //user joins waiting room
    socket.on("join-room", async ({ roomCode, userName }) => {

        try {

            const userId = socket.user._id;

            const contest = await Contest.findOne({ roomCode });

            if (!contest || contest.status !== "waiting") {
                return;
            }

            //Duplicate join prevent
            const alreadyJoined = contest.participants.some(
                (p) => p.userId.toString() === userId.toString()
            );

            if (!alreadyJoined) {
                contest.participants.push({ userId });
                await contest.save();
            }
            // socket ko specific contest room me add karo
            socket.join(roomCode);

            console.log(`👤 ${userName} joined room ${roomCode}`);

            //updated room state sabko bhejo
            await emitRoomState(io, roomCode);

        } catch (error) {
            console.error("JOIN ROOM ERROR: ", error);
        }
    });

    socket.on("leave-room", async ({ roomCode }) => {

        try {
            const userId = socket.user._id;

            const contest = await Contest.findOne({ roomCode });

            if (!contest) {
                return;
            }

            //Owner leaves -> ROOM DESTROY
            if (contest.ownerId.toString === userId.toString) {

                contest.status = "cancelled";
                await contest.save();

                io.to(roomCode).emit("room-closed", {
                    message: "Owner left. Contest Cancelled",
                });

                io.in(roomCode).socketsLeave(roomCode);
                return;
            }

            //Normal user leave the room
            contest.participants = contest.participants.filter(
                p => p.userId.toString() !== userId.toString()
            );

            await contest.save();
            socket.leave(roomCode);

            await emitRoomState(io, roomCode);
        } catch (error) {
            console.error("LEAVE ROOM ERROR:", error);
        }
    })

    socket.on("start-contest", async ({ roomCode }) => {

        try {
            const userId = socket.user._id;

            const contest = await Contest.findOne({ roomCode });

            if (!contest) {
                return;
            }

            //owner check
            if (contest.ownerId.toString() !== userId.toString()) {
                socket.emit("error-message", {
                    message: "Only owner can start the contest",
                });
                return;
            }

            //status update
            contest.status = "running";
            await contest.save();

            //notify everyone
            io.to(roomCode).emit("contest-started", {
                message: "Contest has started",
                contestTime: contest.contestTime,
            });

        } catch (error) {
            console.error("START CONTEST ERROR:", error);
        }
    })
    //socket disconnect
    socket.on("disconnecting", async () => {

        try {
            const userId = socket.user?._id;
            if (!userId) return;

            // const rooms = [...socket.rooms]; // socket.id + joined rooms

            for (const roomCode of socket.rooms) {
                if (roomCode === socket.id) continue;

                const contest = await Contest.findOne({ roomCode });

                if (!contest) {
                    continue;
                }

                //participant remove
                contest.participants = contest.participants.filter(
                    (p) => p.userId.toString() !== socket.userId
                );

                await contest.save();

                //updated list bhejo
                await emitRoomState(io, roomCode);
            }
        } catch (error) {
            console.error("DISCONNECT ERROR", error);
        }
        console.log("Socket disconnected: ", socket.id);
    });
});

/* ===========================
   DATABASE + SERVER START
=========================== */

connectDB()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server + Socket.IO running on port: ${port}`);
        });
    })
    .catch((error) => {
        console.log(`MongoDB connection FAILED !!! ${error}`);
    })

// connectDB()
// .then(() => {
//     app.listen(port, ()=> {
//         console.log(`Server is running at port : ${port}`)
//     })
// })
// .catch((error) => {
//     console.log(`Mongo DB connection FAILED on server !!! ${error}`)
// }) 
