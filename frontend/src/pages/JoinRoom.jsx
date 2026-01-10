import { useParams, useNavigate, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";


/**
 * JoinRoom Component
 * ------------------
 * Flow:
 * 1. Page load → verify room (GET)
 * 2. If valid → show "Join Room" button
 * 3. Button click → join room (POST)
 * 4. Success → redirect to waiting room
 */


function JoinRoom() {

    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [loading, setLoading] = useState(true);
    const [roomValid, setRoomValid] = useState(false);
    const [error, setError] = useState("");
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const verifyRoom = async () => {

            try {
                const res = await axios.get(
                    `/coding/contest/user/verify-room/${roomCode}`,
                    { withCredentials: true }
                );

                if (res.data?.success) {
                    setRoomValid(true);
                } else {
                    setError("Room not found or expired");
                }
            } catch (error) {
                setError("Invalid room link")
            } finally {
                setLoading(false);
            }
        };
        verifyRoom();
    }, [roomCode]);

    //JOIN Room (Post)
    const handleJoinRoom = async () => {

        // user not logged in
        if (!isLoggedIn) {
            navigate("/user/login", {
                state: {redirectTo: `/join/${roomCode}`},
            });
            return;
        }
        try {
            console.log("Room code is", roomCode);
            setJoining(true);
            const res = await axios.post(
                `/coding/contest/user/join/${roomCode}`,
                {},
                { withCredentials: true }
            )
            console.log("JOIN ROOM RESPONSE", res);
            //successfully joined -> go to waiting room
            navigate(`/contest/waiting/${roomCode}`);
        } catch (error) {
            console.log("JOIN ROOM ERROR 👉", error.response);
            console.log("STATUS 👉", error.response?.status);
            console.log("MESSAGE 👉", error.response?.data);
            setError(error.response?.data?.message || "Failed to join room");
        } finally {
            setJoining(false);
        }
    }

    if (loading) {
        return <p className="text-white text-center">Checking room...</p>
    }

    if (!roomValid) {
        return <p className="text-red-500 text-center">{error}</p>
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl font-bold mb-4">Join Coding Contest</h1>
            <p className="text-gray-300 mb-6 text-center">
                You are about to join a live coding contest room.
            </p>
            {error && (
                <p className="text-red-400 mb-4 text-center">{error}</p>
            )}
            <button
                onClick={(handleJoinRoom)}
                disabled={joining}
                className="bg-green-600 px-6 py-2 rounded-full font-bold
                       hover:bg-green-700 transition disabled:opacity-50"
            >
                {joining ? "Joining..." : "Join Room"}
            </button>
        </div>
    )
}

export default JoinRoom;