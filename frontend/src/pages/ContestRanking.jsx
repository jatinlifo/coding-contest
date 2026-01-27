import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ContestRanking() {
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 TEMP / later backend se replace hoga
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // baad me API laga dena
        // const res = await axios.get("/coding/contest/user/leaderboard");
        // setLeaderboard(res.data.leaderboard);

        // dummy data
        setLeaderboard([
          { rank: 1, name: "Jatin", solved: 6, score: 120, time: "32m" },
          { rank: 2, name: "Aman", solved: 5, score: 110, time: "35m" },
          { rank: 3, name: "Ravi", solved: 5, score: 100, time: "40m" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-4 py-6">

      {/* ===== CENTER HEADER ===== */}
      <div className="flex flex-col items-center gap-3 mb-6">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-[#111827] border border-gray-700
                     hover:border-blue-500
                     px-4 py-2 rounded-lg font-semibold transition"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          🏆 Contest Ranking
        </h1>
      </div>

      {/* ===== LEADERBOARD TABLE ===== */}
      <div className="w-full max-w-4xl bg-[#111827]
                      border border-gray-700 rounded-xl overflow-hidden">

        {loading ? (
          <p className="text-center p-6 text-gray-400">
            Loading ranking...
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-[#1f2937]">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-center">Solved</th>
                <th className="p-3 text-center">Score</th>
                <th className="p-3 text-center">Time</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((row) => (
                <tr
                  key={row.rank}
                  className="border-t border-gray-700 hover:bg-black/30 transition"
                >
                  <td className="p-3 font-bold">#{row.rank}</td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3 text-center">{row.solved}</td>
                  <td className="p-3 text-center text-yellow-400 font-bold">
                    {row.score}
                  </td>
                  <td className="p-3 text-center">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ContestRanking;
