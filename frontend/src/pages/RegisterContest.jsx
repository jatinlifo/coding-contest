import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerName } from '../context/OwnerContext';
import axios from 'axios';

function RegisterContest() {
  const [roomName, setRoomName] = useState('');
  const [numberOfUsers, setNumberOfUsers] = useState('');
  const [contestTime, setContestTime] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { toggleDetails } = useOwnerName();

  // Cancel -> go to home
  const handleCancel = () => {
    navigate('/');
  };

  const handleRegisterContest = async (e) => {
    e.preventDefault();

    if (!roomName || !numberOfUsers || !contestTime) {
      setMessage('Please fill in all the details');
      return;
    }

    try {

      const res = await axios.post(
        "/coding/contest/user/create-contest",
        {
          roomName,
          maxUsers: Number(numberOfUsers),
          contestTime: Number(contestTime),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        const contest = res.data.contest;

        // save details in context
        toggleDetails(
          contest.roomName,
          contest.maxUsers,
          contest.contestTime
        );

        navigate('/user/contest/register-contest/select-problems', {
          state: {
            roomName: contest.roomName,
            numberOfUsers: contest.maxUsers,
            contestTime: contest.contestTime,
            roomCode: contest.roomCode,
          }
        });
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to register contest"
      );
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 px-4">

      {/* Card */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Register Contest
        </h1>

        <form onSubmit={handleRegisterContest} className="space-y-6">

          {/* Room Name */}
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          {/* Number of Users */}
          <input
            type="number"
            placeholder="Number of participants (2 - 10)"
            min={2}
            max={10}
            value={numberOfUsers}
            onChange={(e) => setNumberOfUsers(e.target.value)}
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          {/* Contest Time */}
          <select
            value={contestTime}
            onChange={(e) => setContestTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Select contest duration</option>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes</option>
            <option value="60">90 Minutes</option>
          </select>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            Register Contest
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-gray-200 font-semibold py-2 rounded-full hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-red-500 text-center font-semibold mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default RegisterContest;
