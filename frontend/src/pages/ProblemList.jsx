import React from 'react'
import axios from 'axios'
import {useEffect, useState,} from 'react'
import { Link } from 'react-router-dom';
import { useProblem } from '../context/ProblemContext';
import { useOwnerName} from '../context/OwnerContext';
import { useNavigate } from 'react-router-dom';



function ProblemList() {

    const [problems, setProblems] = useState([]);
    const { selectedProblems, toggleProblem } = useProblem();
    const navigate = useNavigate();

    const { ownerName, numberOfUser } = useOwnerName();

    console.log("Comes to ownerName", ownerName);
    console.log("Comes to number of user ", numberOfUser);


    useEffect(() => {
        const fetchProblems = async() => {
            try {
                const {data} = await axios.get("/coding/contest/user/all-problems");
                console.log("React problem data", data);
                const allProblems = data.problems.questions
                console.log("React Questions", allProblems);
                setProblems(allProblems);
            } catch (error) {
                console.log("Error fetching Problems:", error)
            }
        };
        fetchProblems();
    }, [])

    const handleStart = () => {
        navigate('/user/contest/register-contest/select-problems/show-selected-problems')
    }

    return (
        <div className='text-white min-h-screen p-2'>
            <div>
                <h1 className='text-xl'>{ownerName}</h1>
                <h2 className='text-xl'>{numberOfUser}</h2>
                <button className='py-1 px-3 text-xl bg-blue-600'>Link</button>
            </div>
            <div className='flex justify-between px-35'>
                <h1 className='font-bold text-2xl'>Select Problems</h1>
                <button 
                
                className='bg-green-500 px-6 py-2 rounded-full text-2xl font-bold cursor-pointer'
                onClick={handleStart}
                >
                
                Start
                </button>
            </div>
            <h1 className='text-white text-3xl font-bold text-center mb-6'>
                🚀 Problem List
            </h1>
            <div className='overflow-x-auto'>
                <table className='w-full border border-gray-700 rounded-lg'>
                    <thead className='bg-gray-800'>
                        <tr>
                            <th className='py-3 px-4 text-left'>#</th>
                            <th className='py-3 px-4 text-left'>Title</th>
                            <th className='py-3 px-4 text-left'>Difficulty</th>
                            <th className='py-3 px-4 text-left'>🧩 Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((p, index) => (
                            <tr key={p.questionFrontendId} className='border-t border-gray-700 hover:bg-gray-600 transition'>
                                <td className='py-3 px-4 font-semibold'>{index + 1}</td>
                                <td className='py-3 px-4 text-blue-400 font-semibold'>
                                    <Link to={`/problem/p.questionFrontendId`}>{p.title}</Link>
                                </td>
                                <td className={`py-3 px-4 font-semibold ${
                                    p.difficulty === "Easy" ? "text-green-400":
                                    p.difficulty === "Medium" ? "text-yellow-400":
                                    "text-red-400"
                                }`}>
                                    {p.difficulty}
                                </td>
                                <td className='font-semibold px-4 py-3'>
                                    <button
                                    onClick={() => toggleProblem(p)}
                                    className='bg-gray-800 py-1 px-4 rounded-full cursor-pointer'
                                    >
                                        {selectedProblems.some((sp) => sp.questionFrontendId === p.questionFrontendId)
                                        ? "Selected"
                                        : "Select"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProblemList;