import React from 'react'
import { useProblem } from '../context/ProblemContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ShowSelectedProblems () {

    const {selectedProblems} = useProblem();

    if (!selectedProblems) {
        alert("Please Select the Problems:");
        return;
    }

    const navigate = useNavigate();

    console.log("This is selectedProblems", selectedProblems);

    const handleSolve = (problem) => {
        
        navigate('/user/coding/contest/code-editor', {
            state: {problem}
        })
    }

    return (
        <div className='text-white min-h-screen p-2'>
            <h1 className='text-white text-3xl font-bold text-center mb-6'>
                🚀 Solve Problems
            </h1>
            <div className='overflow-x-auto'>
                <table className='w-full border border-gray-700 rounded-lg'>
                    <thead className='bg-gray-800'>
                        <tr>
                            <th className='py-3 px-4 text-left'>#</th>
                            <th className='py-3 px-4 text-left'>Title</th>
                            <th className='py-3 px-4 text-left'>Difficulty</th>
                            <th className='py-3 px-4 text-left'>Solve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProblems.map((p, index) => (
                            <tr key={index} className='border-t border-gray-700'>
                                <td className='py-3 px-4 font-semibold'>{index + 1}</td>
                                <td className='py-3 px-4 text-blue-400 font-semibold'>
                                    <Link to={`/problem/${p.questionFrontendId}`}>{p.title}</Link>
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
                                    onClick={() => handleSolve(p)}
                                    className='bg-gray-800 py-1 px-4 rounded-full cursor-pointer'
                                    >
                                        {selectedProblems.some((sp) => sp.questionFrontendId === p.questionFrontendId)
                                        ? "Solve"
                                        : "Please Select Problem"}
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

export default ShowSelectedProblems;