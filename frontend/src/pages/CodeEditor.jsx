
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useProblem } from '../context/ProblemContext';
import { useLocation } from 'react-router-dom';
import Editor from "@monaco-editor/react";   // ⭐ ADDED

function CodeEditor() {

    const { state } = useLocation();
    console.log("state", state);

    const problem = state?.problem;

    console.log("Selected Problems is comes ", problem);

    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [descripation, setDescripation] = useState("");
    const [constraint, setConstraint] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");
    const { userId } = useAuth();
    const [inputTestCases, setInputTestCases] = useState([]);
    const [outputTestCases, setOutputTestCases] = useState([]);
    const [mergeTestCases, setMergeTestCases] = useState([]);

    const titleSlug = problem.titleSlug;

    useEffect(() => {
    const fetchProblemDetails = async () => {
        try {
            const res = await axios.get(`/coding/contest/user/getsingleproblem/${titleSlug}`);
            const data = res.data;

            console.log("Data is ", data);

            if (data.success) {
                const lines = data.problem.exampleTestcases.split("\n");
                const formattedCases = [];

                for (let i = 0; i < lines.length; i += 2) {
                    formattedCases.push({
                        input: lines[i],
                    });
                }

                setDescripation(data.problem.content);
                setTitle(problem.title);
                setDifficulty(problem.difficulty);
                setInputTestCases(formattedCases);
                
            }
        } catch (error) {
            console.log("Error find to problem details", error);
        }
    };

    if (titleSlug) fetchProblemDetails();
}, [titleSlug]);

console.log("Input testcases", inputTestCases);
// 🔥 extract outputs when description is updated
useEffect(() => {
    if (!descripation) return;

   function extractAllOutputs(html) {
    const regex = /<strong>Output:<\/strong>\s*([^\n<]+)/g;
    const outputs = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
        outputs.push(match[1].trim());
    }

    return outputs;
}

    const outputs = extractAllOutputs(descripation);
    setOutputTestCases(outputs);
    console.log("Extracted outputs:", outputs);
}, [descripation]);

    const languages = [
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
        { value: 'python', label: 'Python' },
        { value: 'javascript', label: 'JavaScript' },
    ];

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

    const handleSave = async () => {
        if (userId === null) {
            alert("Please login")
            return;
        }
        try {
            await axios.post('/coding/contest/user/save-code', { userId, title, language, code },);
            alert("Code saved successfully");
        } catch (error) {
            console.error("Error saving code:", error);
            alert("Failed to save code");
        }
    };

    const handleRunCode = async () => {
        setOutput(`Running your ${language} code...\n\n✅ Output: 42`);
    }

    return (
        <div className='min-h-screen white text-white flex flex-col md:flex-row'>
            {/* Left section (Question) */}
            <div className='md:w-1/2 w-full border-b md:border-b-0 md:border-r-2 border-gray-700 p-6'>
                <h2 className='text-2xl font-bold mb-2'>Q.1 {title}</h2>
                <p className='text-yellow-500 font-bold'>{difficulty}</p>
                <p className='text-gray-400 problem-description'
                    dangerouslySetInnerHTML={{ __html: descripation }}
                >
                </p>
            </div>

            {/* Right Section (Code Editor) */}
            <div className='md:w-1/2 w-full p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-bold mb-2'>Code Editor</h2>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className='bg-gray-800 text-white border-gray-700 rounded-lg px-3 py-2 focus:outline-none'
                    >
                        {languages.map((lang, index) => (
                            <option key={index} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ⭐ MONACO EDITOR HERE (replaces textarea) */}
                <div className='w-full h-[400px] bg-gray-800 border border-gray-700 rounded-lg overflow-hidden'>
                    <Editor
                        height="100%"
                        defaultLanguage={language}
                        language={language}
                        value={code}
                        theme="vs-dark"
                        onChange={(val) => setCode(val)}
                        options={{
                            fontSize: 16,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            automaticLayout: true,
                        }}
                    />
                </div>

                <div className='flex gap-4 mt-4'>
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

                {/* {output && ( */}
                    <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-xl font-bold mb-4">Test Cases:</h3>

                        <div className="flex gap-4 overflow-x-auto">
                            {inputTestCases.map((tc, index) => (
                                <div
                                    key={index}
                                    className="w-60 min-w-[240px] bg-gray-800 border border-gray-700 rounded-lg p-4"
                                >
                                    {/* Case Title */}
                                    <p className="text-lg font-semibold text-blue-400 mb-2">
                                        Case {index + 1}
                                    </p>

                                    {/* Input */}
                                    <div className="mb-2">
                                        <p className="text-gray-400 text-sm mb-1">Input:</p>
                                        <pre className="bg-gray-900 p-2 rounded text-sm overflow-x-auto">
                                            {tc.input}
                                        </pre>
                                    </div>

                                    {/* Expected Output */}
                                    <div className="mb-2">
                                        <p className="text-gray-400 text-sm mb-1">Expected:</p>
                                        <pre className="bg-gray-900 p-2 rounded text-sm overflow-x-auto">
                                            {tc.expected}
                                        </pre>
                                    </div>

                                    {/* Actual Output */}
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Your Output:</p>
                                        <pre className="bg-gray-900 p-2 rounded text-sm text-yellow-300 overflow-x-auto">
                                            {tc.actualOutput || "— run code to view output —"}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                {/* // )} */}
            </div>
        </div>
    )
}

export default CodeEditor;
