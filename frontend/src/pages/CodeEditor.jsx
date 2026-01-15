
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useProblem } from '../context/ProblemContext';
import { useLocation, useParams } from 'react-router-dom';
import Editor from "@monaco-editor/react";   // ⭐ ADDED

function CodeEditor() {

    const { problemId, contestId } = useParams(); // TODO : Contest id pass karni hai
    const { userId } = useAuth();

    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [testCases, setTestcases] = useState([]);
    const [showOutput, setShowOutput] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const languages = [
        { value: "cpp", label: "C++" },
        { value: "java", label: "Java" },
        { value: "python", label: "Python" },
        { value: "javascript", label: "JavaScript" },
    ];

    /* ================= FETCH PROBLEM ================= */
    useEffect(() => {
        const fetchProblemDetails = async () => {
            try {
                const res = await axios.get(`/coding/contest/user/getsingleproblem/${problemId}`);
                const data = res.data;

                console.log("Data is ", data);

                if (data?.success) {
                    setProblem(data.problem)

                    //public testCases only
                    const formatted = data.problem.testCases.map(tc => ({
                        input: tc.input,
                        expected: tc.expectedOutput,
                        explanation: tc.explanation,
                        actulOutput: "",
                    }));

                    setTestcases(formatted);
                }
            } catch (error) {
                console.error("Error find to problem details", error);
            }
        };

        fetchProblemDetails();
    }, [problemId]);

    // ================ SAVE CODE==========

    const handleSave = async () => {
        if (!userId) {
            return alert("Please login");
        }

        try {
            await axios.post("/coding/contest/user/save-code", {
                userId,
                problemId,
                language,
                code,
            });
            alert("Code Saved");
        } catch {
            alert("Failed to save code");
        }
    };

    // ================= RUN CDOE ================
    const handleRunCode = async () => {
        try {
            const res = await axios.post("/coding/api/judge/run", {
                code,
                language,
                testcases: testCases.map(tc => ({
                    input: tc.input,
                    expected: tc.expected,
                    explanation: tc.explanation,
                })),
            });;

            console.log("Run code output", res?.data);

            const results = res.data.results;

            // Update each test case with actual output
            const updated = testCases.map((tc, index) => ({
                ...tc,
                actualOutput: results[index].actualOutput || "",
            }));

            setTestcases(updated);
            setShowOutput(true);

        } catch (err) {
            console.log("Error:", err);
            alert("Error running code");
        }
    };

    // ============ Submit code ============
    const handleSubmitCode = async () => {

        if (!userId) {
            alert("Please login");
            return;
        }
        if (!code.trim()) {
            return alert("Code cannot be empty");
        }

        try {
            const res = await axios.post(
                "/coding/contest/user/submit",
                {
                    userId,
                    contestId,
                    problemId,
                    code,
                    language,
                },
                { withCredentials: true }
            );

            alert(`Verdict: ${res.data.verdict}\nScore: ${res.data.score}`);
        } catch (error) {
            alert(error?.response.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    }

    if (!problem) {
        return <p className='text-white text-center'>Loading problem...</p>
    }


    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col md:flex-row">

            {/* ===== LEFT SIDE (Problem Panel) ===== */}
            <div className="md:w-1/2 w-full border-b md:border-b-0 md:border-r border-gray-700 p-5 
      overflow-y-auto md:h-screen">

                {/* Title */}
                <h2 className="text-2xl font-bold mb-2">
                    Q.{problem.problemNumber} {problem.title}
                </h2>

                {/* Difficulty */}
                <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-5
        ${problem.difficulty === "Easy"
                            ? "bg-green-700 text-green-200"
                            : problem.difficulty === "Medium"
                                ? "bg-yellow-700 text-yellow-200"
                                : "bg-red-700 text-red-200"
                        }`}
                >
                    {problem.difficulty}
                </span>

                {/* Description */}
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <div
                    className="prose prose-invert max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{ __html: problem.description }}
                />

                {/* ===== EXAMPLES ===== */}
                <h3 className="text-lg font-bold mt-8 mb-3">Examples</h3>

                <div className="space-y-4">
                    {problem.testCases.map((tc, index) => (
                        <div
                            key={index}
                            className="bg-[#111827] border border-gray-700 rounded-xl p-4"
                        >
                            <p className="font-bold text-blue-400 mb-3">
                                Example {index + 1}
                            </p>

                            {/* Input */}
                            <p className="text-sm text-gray-400 mb-1">Input:</p>
                            <pre className="bg-black/40 p-3 rounded-lg text-sm overflow-x-auto">
                                {tc.input}
                            </pre>

                            {/* Output */}
                            <p className="text-sm text-gray-400 mt-3 mb-1">Output:</p>
                            <pre className="bg-black/40 p-3 rounded-lg text-sm overflow-x-auto">
                                {tc.expectedOutput}
                            </pre>

                            {/* Explanation */}
                            {tc.explanation && (
                                <>
                                    <p className="text-sm text-gray-400 mt-3 mb-1">
                                        Explanation:
                                    </p>
                                    <div className="text-gray-300 text-sm bg-black/30 p-3 rounded-lg">
                                        {tc.explanation}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* ===== CONSTRAINTS ===== */}
                <h3 className="text-lg font-bold mt-8 mb-2">Constraints</h3>
                <div
                    className="text-gray-300 bg-[#111827] border border-gray-700 rounded-xl p-4 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: problem.constraints }}
                />
            </div>

            {/* ===== RIGHT SIDE (Editor Panel) ===== */}
            <div className="md:w-1/2 w-full p-5  flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Code Editor</h2>

                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-[#111827] text-white border border-gray-700 rounded-lg px-3 py-2 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Monaco Editor */}
                <div className="h-[55vh] md:h-[65vh] bg-[#111827] border border-gray-700 rounded-xl overflow-hidden">
                    <Editor
                        height="100%"
                        defaultLanguage={language}
                        language={language}
                        value={code}
                        theme="vs-dark"
                        onChange={(val) => setCode(val || "")}
                        options={{
                            fontSize: 15,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            mouseWheelZoom: true,
                            cursorSmoothCaretAnimation: "on",
                            wordWrap: "on",
                            automaticLayout: true,
                            scrollbar: {
                                vertical: "auto",
                                horizontal: "auto",
                                verticalScrollbarSize: 10,
                                horizontalScrollbarSize: 10,
                            },
                        }}
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
                    >
                        💾 Save
                    </button>

                    <button
                        onClick={handleRunCode}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
                    >
                        ▶️ Run
                    </button>

                    <button
                        onClick={handleSubmitCode}
                        disabled={submitting}
                        className={`px-4 py-2 rounded-lg font-semibold transition
            ${submitting
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700"
                            }`}
                    >
                        🚀 {submitting ? "Submitting..." : "Submit"}
                    </button>
                </div>

                {/* ===== OUTPUT PANEL ===== */}
                {showOutput && (
                    <div className="mt-5 bg-[#111827] border border-gray-700 rounded-xl p-4">
                        <h3 className="text-lg font-bold mb-3">Test Case Results</h3>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {testCases.map((tc, index) => (
                                <div
                                    key={index}
                                    className="min-w-[240px] bg-black/30 border border-gray-700 rounded-xl p-4"
                                >
                                    <p className="text-blue-400 font-semibold mb-2">
                                        Case {index + 1}
                                    </p>

                                    <p className="text-gray-400 text-sm">Input:</p>
                                    <pre className="bg-black/40 p-2 rounded-lg text-sm overflow-x-auto">
                                        {tc.input}
                                    </pre>

                                    <p className="text-gray-400 text-sm mt-2">Expected:</p>
                                    <pre className="bg-black/40 p-2 rounded-lg text-sm overflow-x-auto">
                                        {tc.expected}
                                    </pre>

                                    <p className="text-gray-400 text-sm mt-2">Your Output:</p>
                                    <pre className="bg-black/40 p-2 rounded-lg text-sm text-yellow-300 overflow-x-auto">
                                        {tc.actualOutput || "— run code to view output —"}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CodeEditor;

