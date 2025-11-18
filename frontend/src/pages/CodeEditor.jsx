import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useProblem } from '../context/ProblemContext';
import { useLocation } from 'react-router-dom';

function CodeEditor() {

    const { state } = useLocation();
    const { problem } = state;

    // if (!problem) {
    //     alert("Not solve problem");
    //     return;
    // }

    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [descripation, setDescripation] = useState("");
    const [constraint, setConstraint] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");
    const { userId } = useAuth();
    const [testCases, setTestCases] = useState([]);


    console.log("Selected Problems is comes ", problem);

    setTitle(problem.title)
    setDifficulty(problem.difficulty);
    const titleSlug = problem.titleSlug;

    useEffect(() => {
        const fetchProblemDetails = async() => {
    
            try {
                const res = await axios.get(`/coding/contest/user//getsingleproblem/${titleSlug}`);
    
                console.log("Slug response", res);
    
                if (res.data.success) {
                    const lines = problem.exampleTestcases.split("\n");
    
                    for (let i=0; i < lines.length; i += 2) {
                        testCases.push({
                            input: lines[i],
                            expected: lines[i + 1]
                        });
                    }
                    setDescripation(res.data.content);
                }
            } catch (error) {
                console.log("Error find to problem details", error);
            }
        }
        fetchProblemDetails();
    }, [problem])

    const languages = [
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
        { value: 'python', label: 'Python' },
        { value: 'javascript', label: 'JavaScript' },
    ];

    // ==== page reload time pa code fetch
    useEffect(() => {
        if (!userId || !title) return;

        const fetchCode = async () => {

            try {
                const res = await axios.get('/coding/contest/user/code', {
                    params: { userId, title },
                });

                if (res.data.sucess) {
                    setCode(res.data.code || "");
                    setLanguage(res.data.language || "javascript")
                }
            } catch (error) {
                console.log("No previous code found");
            }
        };
        fetchCode();
    }, [userId, title]);


    //  =============== SAVE CODE ==============
    const handleSave = async () => {
        if (userId === null) {
            alert("Please login")
            return;
        }
        try {
            await axios.post('/coding/contest/user/save-code', { userId, title, language, code },);
            alert("Code saved sucessfully code:");
        } catch (error) {
            console.error("Error saving code:", error);
            alert("Failed to save code");
        }
    };

    // ============ RUN CODE =============
    const handleRunCode = async () => {
        setOutput(`Running your ${language} code...\n\n✅ Output: 42`);
    }

    return (
        <div className='min-h-screen white text-white flex flex-col md:flex-row'>  
            {/* Left section (Question) */}
            <div className='md:w-1/2 w-full border-b md:border-b-0  md:border-r-2 border-gray-700 p-6'>
                <h2 className='text-2xl font-bold mb-2'>{title}</h2>
                <p className='text-gray-400'
                dangerouslySetInnerHTML={{__html: descripation }}
                >
                </p>
            </div>

            {/* Right Section (Code Editor) */}
            <div className='md:w-1/2 w-full p-6'>
                {/* header with language selector */}
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-bold mb-2'>Code Editor</h2>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className='bg-gray-800 text-white border-gray-700 rounded-lg px-3 py-2 focus:outline-none'
                    >
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className='w-full h-[400px] bg-gray-800 text-white p-4 rounded-lg
                     border border-gray-700 resize-none focus:outline-none'
                />

                {/* Buttons  */}
                <div className='flex gap-4 mt-4'>
                    {/* save button  */}
                    <button
                        onClick={handleSave}
                        className='mt-4 bg-blue-600 hover:bg-blue-700 text-white
                px-4 py-2 rounded-full transition'
                    >
                        💾 Save Code
                    </button>

                    <button
                        onClick={handleRunCode}
                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2
                rounded-lg transition'
                    >
                        ▶️ Run Code
                    </button>
                </div>

                {/* Output Section  */}
                {output && (
                    <div className='mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4'>
                        <h3 className='text-xl font-bold mb-2'>Output:</h3>
                        <pre className='text-green-400 whitespace-pre-wrap'>{output}</pre>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CodeEditor;