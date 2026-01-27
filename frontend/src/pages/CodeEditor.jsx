
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useProblem } from '../context/ProblemContext';
import { useLocation, useParams } from 'react-router-dom';
import Editor from "@monaco-editor/react";   // ⭐ ADDED
import { useNavigate } from 'react-router-dom';

function CodeEditor() {

    const { problemId, contestId } = useParams(); // TODO : Contest id pass karni hai
    const { userId } = useAuth();

    const outputRef = useRef(null); // added: run/submit ke badd output panel scroll karvana ka liya
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [testCases, setTestcases] = useState([]);
    const [showOutput, setShowOutput] = useState(true);

    const [submitting, setSubmitting] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const [runResultsSummary, setRunResultSummary] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);

    const [solved, setSolved] = useState(false);
    const [topVerdictMessage, setTopVerdictMessage] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const [isProblemMenuOpen, setIsProblemMenuOpen] = useState(false);

    const selectedProblemIds = location?.state?.problems || [];

    console.log("Selected problems Ids", selectedProblemIds);
    // const [selectedProblems, setSelectedProblems] = useState([]);
    // setSelectedProblems(selectedProblemIds);

    const languages = [
        { value: "cpp", label: "C++" },
        { value: "java", label: "Java" },
        { value: "python", label: "Python" },
        { value: "javascript", label: "JavaScript" },
    ];

    //==========FETCH SELECTED PROBLEMS (FOR POPUP) =============
    // useEffect(() => {

    //     const fetchSelectedProblems = async () => {

    //         try {
    //             if (!selectedProblemIds.length) return;

    //             const res = await axios.post("/coding/contest/user/get-selected-problems", {
    //                 problemIds: selectedProblemIds
    //             });

    //             if (res.data?.success) {
    //                 setSelectedProblems(res.data.problems);
    //             }
    //         } catch (error) {
    //             console.log("Error fetching all problems in codeEditor", error)
    //         }
    //     };
    //     fetchSelectedProblems();
    // }, [selectedProblemIds]);

    /* ================= FETCH SINGLE PROBLEM ================= */
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
                        actualOutput: "",
                        passed: null,
                        status: "Not Run",
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

    //========== testcases card color decide =========
    const getTestcaseClass = (tc) => {

        if (tc.passed === true) {
            return "border-green-500 bg-green-900/20";
        }
        if (tc.passed === false) {
            return "border-red-500 bg-red-900/20";
        }

        return "border-gray-700 bg-black/30";
    };

    // ========= verdict badge style (Run + Submit)
    const getVerdictBadge = (verdict) => {

        if (!verdict) {
            return "bg-gray-700 text-gray-200";
        }

        const v = verdict.toLowerCase();

        if (v.includes("accepted")) return "bg-green-700 text-green-200";
        if (v.includes("wrong")) return "bg-red-700 text-red-200";
        if (v.includes("time")) return "bg-yellow-700 text-yellow-200";
        if (v.includes("runtime")) return "bg-orage-700 text-orange-200";

        return "bg-gray-700 text-gray-200";
    }

    // ================= RUN CDOE ================
    const handleRunCode = async () => {

        if (!code.trim()) return alert("Code cannot be empty")

        try {

            setIsRunning(true);
            setTopVerdictMessage("");
            setSubmitResult(null);
            setSolved(false);

            //before run testcase fresh start
            setTestcases((prev) =>
                prev.map((tc) => ({
                    ...tc,
                    actualOutput: "",
                    passed: null,
                    status: "Running...",
                })));

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

            const results = res.data.results || [];

            // Update each test case with actual output
            const updated = testCases.map((tc, index) => {
                const r = results[index];

                return {
                    ...tc,
                    actualOutput: r?.actualOutput || "",
                    passed: r?.passed ?? false,
                    status: r?.status || (r?.passed ? "Accepted" : "Wrong Answer"),
                    expected: r?.expected ?? tc.expected,
                };
            });

            setTestcases(updated);

            setRunResultSummary({
                total: res.data.total,
                passedCount: res.data.passedCount,
                failedCount: res.data.failedCount,
            })
            setShowOutput(true);

            setTimeout(() => {
                outputRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 200);
        } catch (err) {
            console.log("Error:", err);
            alert("Error running code");
        } finally {
            setIsRunning(false);
        }
    };

    // ============ Submit code ============
    const handleSubmitCode = async () => {

        // if (!userId) {
        //     alert("Please login");
        //     return;
        // }
        if (!code.trim()) {
            return alert("Code cannot be empty");
        }

        try {
            setSubmitting(true);
            setTopVerdictMessage("");
            const res = await axios.post(
                "/coding/api/judge/submit",
                {
                    // userId,
                    // contestId,
                    problemId,
                    code,
                    language,
                },
                { withCredentials: true }
            );
            console.log("Submit data", res.data);

            setSubmitResult(res?.data);

            setTopVerdictMessage(
                res?.data.verdict === "Accepted"
                    ? "Your code Accepted"
                    : `${res.data.verdict}`
            )

            if (res?.data.verdict === "Accepted") {
                setSolved(true);
            }
            alert(`Verdict: ${res.data.verdict}\nScore: ${res.data.score}`);

            setTimeout(() => {
                outputRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 200)
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
                    {solved && (
                        <span className='text-green-400 text-xl' title='Solved'>
                            ✅
                        </span>
                    )}
                </h2>

                {/* Leetcode-style top verdict banner  */}
                {topVerdictMessage && (
                    <div className='mb-4 border border-gray-700 bg-[#111827] rounded-xl px-4 py-3'>
                        <p className='font-semibold'>
                            {topVerdictMessage}
                        </p>

                        {/* show runtime/memory  */}
                        {submitResult?.time && submitResult?.memory && (
                            <p className='text-gray-400 text-sm mt-1'>
                                Runtime: <span className='text-white'>
                                    {submitResult.time}
                                </span>
                                {" "} | Memory: {" "}
                                <span className='text-white'>
                                    {submitResult.memory}
                                </span>
                            </p>
                        )}
                    </div>
                )}

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
                    {/* LEFT PART  */}
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={() => setIsProblemMenuOpen(true)}
                            className='bg-[#111827] border border-gray-700
                        hover:border-blue-500 px-3 py-2
                        rounded-lg font-semibold'
                        >
                            ☰ Problems
                        </button>
                        <h2 className="text-xl font-bold">Code Editor</h2>
                        <button
                        onClick={() => navigate("/user/coding/contest/ranking")}
                        className='bg-[#111827] border border-gray-700
                                   hover:border-yellow-500 px-3 py-2
                                   rounded-lg font-semibold'
                        >
                            🏆 Ranking
                        </button>
                    </div>
                    {/* RIGHT PART  */}
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
                    {/* Run code  */}
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className={`px-4 py-2 rounded-lg font-semibold transition
                         ${isRunning ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                    >
                        ▶️ {isRunning ? "Running..." : "Run"}
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
                    <div
                        ref={outputRef}
                        className="mt-5 bg-[#111827] border border-gray-700 rounded-xl p-4">

                        <div className='flex items-center justify-between mb-3'>
                            <h3 className="text-lg font-bold">Test Case Results</h3>

                            {/* summary in header  */}
                            {runResultsSummary && (
                                <div className='text-sm text-gray-300'>
                                    <span className='mr-2'>
                                        Passed{" "}
                                        <span className='text-white font-semibold'>
                                            {runResultsSummary.passedCount}/{runResultsSummary.total}
                                        </span>
                                    </span>

                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-bold ${runResultsSummary.failedCount === 0
                                            ? "bg-green-700 text-green-200"
                                            : "bg-red-700 text-red-200"
                                            }`}
                                    >
                                        {runResultsSummary.failedCount === 0}
                                        ? "All Passed"
                                        : `${runResultsSummary.failedCount} Failed`
                                    </span>
                                </div>
                            )}

                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {testCases.map((tc, index) => (
                                <div
                                    key={index}
                                    // updated: dynamic color based on pass/fail 
                                    className={`min-w-[240px] bg-black/30 border rounded-xl p-4 transition ${getTestcaseClass(tc)}`}
                                >
                                    <div className='flex items-center justify-between mb-2'>
                                        <p className="text-blue-400 font-semibold">
                                            Case {index + 1}
                                        </p>

                                        {/* status badge  */}/
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs font-bold ${getVerdictBadge}`}
                                        >
                                            {tc.status}
                                        </span>
                                    </div>

                                    {/* pass/fail test case icon */}
                                    <p className='text-sm mb-2'>
                                        {tc.passed === true && (
                                            <span className='text-green-400 font-semibold'>
                                                Passed
                                            </span>
                                        )}
                                        {tc.passed === false && (
                                            <span className='text-red-400 font-semibold'>
                                                Failed
                                            </span>
                                        )}
                                        {tc.passed === null && (
                                            <span className='text-gray-400'>
                                                Not Run
                                            </span>
                                        )}
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
                                    <pre
                                        className={`bg-black/40 p-2 rounded-lg text-sm overflow-x-auto
                      ${tc.passed === true ? "text-green-300" : tc.passed === false ? "text-red-300" : "text-yellow-300"}`}
                                    >
                                        {tc.actualOutput || "— run code to view output —"}
                                    </pre>
                                </div>
                            ))}
                        </div>

                        {/* submit result box in output panel  */}
                        {submitResult && (
                            <div className='mt-4 border border-gray-700
                        rounded-xl p-4 bg-black/20'>
                                <h4 className='font-bold mb-2'>
                                    Submission Result
                                </h4>
                                <div className='flex flex-wrap gap-2 items-center'>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-sm font-bold ${getVerdictBadge(
                                            submitResult.verdict
                                        )}`}
                                    >
                                        {submitResult.verdict}
                                    </span>

                                    <span className='text-gray-300 text-sm'>
                                        Score: {" "}
                                        <span className='text-white font-semibold'>
                                            {submitResult.score ?? "-"}
                                        </span>
                                    </span>

                                    {/* runtime/memory show if backend provide  */}
                                    {submitResult.time && (
                                        <span className='text-gray-300 text-sm'>
                                            Time: {" "}
                                            <span className='text-white font-semibold'>
                                                {submitResult.time}
                                            </span>
                                        </span>
                                    )}
                                    {submitResult.memory && (
                                        <span className='text-gray-300 text-sm'>
                                            Memory: {" "}
                                            <span className='text-white font-semibold'>
                                                {submitResult.memory}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ================= LEFT PROBLEM POPUP ================= */}
            {isProblemMenuOpen && (
                <div className="fixed inset-0 z-50 flex">

                    {/* BACKGROUND */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setIsProblemMenuOpen(false)}
                    />

                    {/* POPUP */}
                    <div className="relative w-[320px] h-full
                        bg-[#0b1220]
                        border-r border-gray-700
                        p-4 overflow-y-auto">

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Problems</h3>
                            <button
                                onClick={() => setIsProblemMenuOpen(false)}
                                className="bg-red-600 px-3 py-1 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {selectedProblemIds?.map((p) => {
                            const isActive =
                                String(p._id) === String(problemId);

                            return (
                                <button
                                    key={p._id}
                                    onClick={() => {
                                        navigate(
                                            `/user/coding/contest/code-editor/${p._id}`,
                                            // { state: { problems: selectedProblemIds } }
                                        );
                                        setIsProblemMenuOpen(false);
                                    }}
                                    className={`w-full text-left p-3 mb-2 rounded-xl border
                        ${isActive
                                            ? "border-blue-500 bg-blue-900/20"
                                            : "border-gray-700 bg-[#111827]"
                                        }`}
                                >
                                    <p className="font-semibold">
                                        {p.problemNumber}. {p.title}
                                    </p>

                                    <span className={`text-xs px-2 py-1 rounded-md
                        ${p.difficulty === "Easy"
                                            ? "bg-green-700"
                                            : p.difficulty === "Medium"
                                                ? "bg-yellow-700"
                                                : "bg-red-700"
                                        }`}>
                                        {p.difficulty}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>

    );


}

export default CodeEditor;

