import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useProblem } from '../context/ProblemContext';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const { selectedProblems, toggleProblem } = useProblem();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [inviteLink, setInviteLink] = useState("");

  const { roomName, numberOfUsers, contestTime } = state ?? {};

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('/coding/contest/user/all-problems');
        setProblems(res.data.problems);
      } catch (error) {
        console.log('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, []);

  // ======= check existing link
  // useEffect(()=> {
  //   const checkExistingLink = async () => {

  //     try {
  //       const res = await axios.get(
  //         "/coding/contest/user/existing-link",
  //         {withCredentials: true}
  //       );
  //       console.log("Exising link", res.data);
  //       if (res.data?.inviteLink) {
  //         setInviteLink(res.data.inviteLink);
  //       }
  //     } catch (error) {
  //       // alert("This link is expire generate new link")
  //     }
  //   }
  //   checkExistingLink();
  // },[])


  // ======== Gnerate invite link & Copy to clipboard

  const handleGenerateLink = async () => {

    try {

      if (inviteLink) {
        //clipboard me copy
        await navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied! Share it with your friends.")
        return;
      }
      const res = await axios.post(
        "/coding/contest/user/generate-link",
        {},
        {
          withCredentials: true,
        }
      );

      //get invite link
      const link = res.data?.inviteLink;

      if (!link) {
        alert("Failed to generate ivite link")
      }
      setInviteLink(link);
      
      //copy
      // await navigator.clipboard.writeText(link);
      alert("Invite link generated");
    } catch (error) {
      alert("Failed to generate invite link");
    }
  }


  const getRoomCodeFromLink = () => {
    if (!inviteLink) return null;

    return inviteLink.split("/join/")[1];
  }

  // const handleStart = () => {
  //   navigate(
  //     '/user/contest/register-contest/select-problems/show-selected-problems',
  //     {
  //       state: {
  //         roomName,
  //         numberOfUsers,
  //         contestTime,
  //         selectedProblems,
  //       },
  //     }
  //   );
  // };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 md:px-10 py-6">

      {/* ===== ROOM SUMMARY ===== */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row md:justify-between gap-6">
        <div>
          <p className="text-gray-400 text-sm">Room Name</p>
          <h1 className="text-2xl font-bold">{roomName}</h1>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Participants</p>
          <h2 className="text-xl font-semibold">{numberOfUsers}</h2>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Contest Time</p>
          <h2 className="text-xl font-semibold">{contestTime} min</h2>
        </div>

        <button
          onClick={handleGenerateLink}
          className="bg-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
          {inviteLink ? "Copy Link" : " Generate Link"}
        </button>
          <button
          onClick={()=> {
            if (selectedProblems.length === 0) {
              alert("Please select at least one problem before joining");
              return;
            }
            let roomCode = inviteLink ? getRoomCodeFromLink() : state.roomCode;

            if (!roomCode) {
              alert("Room code not found. Generate link once.")
            }
            navigate(`/contest/waiting/${roomCode}`, {
              state: {
                roomName,
                numberOfUsers,
                contestTime,
                selectedProblems,
                isOwner: true,
              }
            });
          }}
          className='bg-green-600 px-5 py-1 rounded-full font-semibold hover:bg-green-700 transition'
          >
            Join
          </button>
      </div>

      {/* ===== HEADER ===== */}
      {/* <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">🚀 Select Problems</h1>
        <button
          className="bg-green-500 px-6 py-2 rounded-full text-lg font-bold hover:bg-green-600 transition disabled:opacity-50"
          onClick={handleStart}
          disabled={selectedProblems.length === 0}
        >
          Start Contest
        </button>
      </div> */}

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="min-w-full bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Difficulty</th>
              <th className="py-3 px-4 text-center">Select</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p, index) => {
              const isSelected = selectedProblems.some(
                (sp) => sp._id === p._id
              );

              return (
                <tr
                  key={p._id}
                  className="border-t border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="py-3 px-4">{index + 1}</td>

                  <td className="py-3 px-4 text-blue-400 font-semibold">
                    <Link to={`/problem/${p._id}`}>
                      {p.title}
                    </Link>
                  </td>

                  <td
                    className={`py-3 px-4 font-semibold ${p.difficulty === 'Easy'
                      ? 'text-green-400'
                      : p.difficulty === 'Medium'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                      }`}
                  >
                    {p.difficulty}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleProblem(p)}
                      className={`px-4 py-1 rounded-full font-semibold transition ${isSelected
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      <p className="text-gray-400 text-center mt-6">
        Selected Problems:{' '}
        <span className="font-bold text-white">
          {selectedProblems.length}
        </span>
      </p>
    </div>
  );
}

export default ProblemList;
