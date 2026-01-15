import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext';
import {socket} from '../socket.js'

function WaitingRoom() {

    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();
    console.log("USer id ", userId);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    const { state } = useLocation();
    const {roomName, contestTime, selectedProblems} = state || {};

    // console.log("Owner comes", isOwner);
    console.log("Problems IDS", selectedProblems);

    // ================= HTTP VALIDATION =================
    useEffect(() => {
        const fetchRoom = async () => {

            try {
                const res = await axios.get(
                    `/coding/contest/user/waiting-room/${roomCode}`,
                    { withCredentials: true }
                );
                console.log("Room data", res.data);
                // setRoom(res?.data);
                if (res?.data.isOwner) {
                    setIsOwner(true);
                }

            } catch (error) {
                alert("Failed to load room");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomCode]);

    /* =========================
       SOCKET LOGIC
  ========================== */

    useEffect(() => {

        if (loading) return;

        // join room
        socket.emit("join-room", { roomCode });

        //listen room updates
        socket.on("room-update", (data) => {
            setRoom(data);
        });

        //contest start
        socket.on("contest-started", ({roomCode, problems, contestTime}) => {
            console.log("Contest time to share start contest", contestTime);
            console.log("Problems to share start contest", problems);
            navigate(`/user/coding/contest/start-contest/${roomCode}`, {
                state: {
                    problems,
                    contestTime,
                    roomName,
                }
            });
        });

        socket.on("room-closed", (data) => {
            alert(data.message);
            socket.disconnect();
            navigate("/");
        });

        socket.on("error-message", ({ message }) => {
            alert(message);
        })

        return () => {
            socket.off("room-update");
            socket.off("contest-started");
            socket.off("room-closed");
            socket.off("error-message");
        };
    }, [loading, roomCode, navigate]);

    const handleLeaveRoom = () => {

        socket.emit("leave-room", { roomCode });
        navigate("/");
    };

    const handleStartContest = async () => {

        // try {
        //     await axios.post(
        //         `/coding/contest/user/start-contest/${roomCode}`,
        //         {},
        //         { withCredentials: true }
        //     );

        //     navigate(`/user/coding/contest/code-editor/${roomCode}`)
        // } catch (error) {
        //     alert("Only owner can start contest");
        // }/

        if (!selectedProblems || selectedProblems.length === 0) {
            alert("Please select at least on problem before starting the contest");
            return;
        }
        socket.emit("start-contest", {
            roomCode,
            problems: selectedProblems,
            contestTime
        });
    };

    if (loading || !room) {
        return <p className='text-white text-center'>Loading...</p>
    }
    console.log("ROOM vs ROOM", room);
    if (room?.isOwner) {
        setIsOwner(true);
    }
    // const isOwner = room?.owner?.id === userId;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex justify-center px-4 pt-16 md:pt-24">

            {/* Main Container */}
            <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-lg p-6 md:p-">

                {/* ===== TOP BAR ===== */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-700 pb-4 mb-6">

                    {/* Owner */}
                    <div className="text-center md:text-left">
                        <p className="text-sm text-gray-400">Owner 👑</p>
                        <p className="text-lg font-semibold">
                            {room.owner.name}
                        </p>
                    </div>

                    {/* Room Name */}
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {room?.roomName}
                        </h1>
                    </div>

                    {/* Contest Time */}
                    <div className="text-center md:text-right">
                        <p className="text-sm text-gray-400">Contest Time ⏱️</p>
                        <p className="text-lg font-semibold">
                            {room?.contestTime} minutes
                        </p>
                    </div>
                </div>

                {/* ===== JOINED INFO ===== */}
                <div className="flex justify-between mb-4">
                    <p>👥 Joined: <b>{room.joinedUsers}</b></p>
                    <p>🪑 Slots Left: <b>{room.maxUsers - room.joinedUsers}</b></p>
                </div>

                {/* ===== PARTICIPANTS LIST ===== */}
                <div className="border border-gray-700 rounded-xl overflow-hidden mb-8">

                    {/* Header Row */}
                    <div className="grid grid-cols-12 bg-gray-700 px-4 py-2 text-sm font-semibold">
                        <div className="col-span-2">S.No</div>
                        <div className="col-span-10">Participant Name</div>
                    </div>

                    {/* Rows */}
                    {room?.participants.map((p) => (
                        <div
                            key={p.id}
                            className="grid grid-cols-12 px-4 py-3 border-t border-gray-700 items-center hover:bg-gray-700 transition"
                        >
                            {/* Serial Number */}
                            <div className="col-span-2 font-semibold text-gray-300">
                                {p.sno}.
                            </div>

                            {/* Name with Emoji */}
                            <div className="col-span-10 font-medium">
                                😀 {p.name}
                                {p.id === room?.owner?.id && (
                                    <span className="ml-2 text-yellow-400 text-sm">(Owner)</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== ACTION AREA ===== */}
                <div className="flex md:justify-between">
                    <button 
                    onClick={handleLeaveRoom}
                    className='bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold'
                    >
                        🚪Leave Room
                    </button>
                    {isOwner ? (
                        <button
                            onClick={handleStartContest}
                            className="bg-green-600 hover:bg-green-700 transition px-8 py-3 rounded-full font-bold text-lg"
                        >
                            🚀 Start Contest
                        </button>
                    ) : (
                        <p className="text-yellow-400 font-semibold text-center md:text-right">
                            ⏳ Waiting for owner to start the contest...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

}

export default WaitingRoom;