import axios from "axios";
import { Code } from "../models/code.model.js";
import { Problem } from "../models/problem.model.js";   // ✅ FIXED (was missing)
import { LeetCode } from "leetcode-query";
import { Submission } from "../models/submission.model.js";
// ================= Save Code =================
const saveCode = async (req, res) => {
    try {
        const { userId, title, language, code } = req.body;

        const user = await Code.create({
            userId,
            title,
            language,
            code,
        });

        return res.status(201).json({
            success: true,
            message: "Code saved successfully",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error saving code",
            error,
        });
    }
};

// ================= Fetch Code =================
const fetchCode = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID required",
            });
        }

        const user = await Code.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User code fetched",
            code: user.code,
            language: user.language,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching code",
            error,
        });
    }
};

// ============== SUBMIT CODE ==================
const submitCode = async (req, res) => {

    try {
    const { userId, problemId, code, language } = req.body;

    const problem = await Problem.findById(problemId);

    if (!problem) {
        return res
        .status(400)
        .json({
            success: false,
            message: "Problem not found"
        })
    }
    const testcases = problem.testCases;
    const score = problem.score;

    console.log("Problem find", problem);
    console.log("test cases", testcases);

    if (!code || !language || !Array.isArray(testcases)) {
      return res.status(400).json({
        success: false,
        message: "code, language, testcases are required",
      });
    }

    const langMap = { cpp: 54, java: 62, python: 71, javascript: 63 };
    const language_id = langMap[language];

    if (!language_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
      });
    }

    let verdict = "Accepted";
    let passedCount = 0;
    let failedCount = 0;
    let time = 0;
    let memory = 0;

    for (const tc of testcases) {
      try {
        const submission = await axios.post(
          "https://ce.judge0.com/submissions?wait=true",
          {
            source_code: code,
            language_id,
            stdin: tc.input ?? "",
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 20000,
          }
        );

        const data = submission.data;

        console.log("SUBMIT DATA", data);

        const stdout = (data.stdout || "").trim();
        const stderr = (data.stderr || "").trim();
        const compileOut = (data.compile_output || "").trim();
        const status = data?.status?.description || "Unknown";
        time = (data.time || "").trim();
        memory = (data.memory || "").trim();

        const actualOutput = stdout || compileOut || stderr || "";

        const expected = (tc.expected ?? "").trim();

        // ✅ If compilation error / runtime error => direct fail
        if (status !== "Accepted") {
          verdict = status; // "Compilation Error", "Runtime Error", etc.
          failedCount++;
          break;
        }

        // ✅ output mismatch => Wrong Answer
        if (expected && actualOutput.trim() !== expected) {
          verdict = "Wrong Answer";
          failedCount++;
          break;
        }

        passedCount++;
      } catch (error) {
        verdict = "Judge Error";
        failedCount++;
        break;
      }
    }

    const total = testcases.length;

    return res.json({
      success: true,
      verdict,
      total,
      passedCount,
      failedCount: total - passedCount,
      score,
      time,
      memory,
    });
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    return res.status(500).json({ success: false, message: "Submit failed" });
  }
}

// ================= Add Problem =================
const addProblem = async (req, res) => {
    try {
        const {
            problemNumber,
            title,
            description,
            difficulty,
            constraints,
            score,
            timeLimit,
            memoryLimit,
            languages,
            testCases,
        } = req.body;

        /* ================= VALIDATION ================= */
        if (
            !problemNumber ||
            !title ||
            !description ||
            !difficulty ||
            !languages ||
            !testCases
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        /* ================= DUPLICATE CHECK ================= */
        const existingProblem = await Problem.findOne({
            $or: [
                { problemNumber },
                { title: new RegExp(`^${title}$`, "i") },
            ],
        });

        if (existingProblem) {
            return res.status(409).json({
                success: false,
                message: "Problem already exists",
            });
        }

        /* ================= CREATE PROBLEM ================= */
        const newProblem = await Problem.create({
            problemNumber,
            title: title.trim().toLowerCase(),
            description,
            difficulty,
            constraints,
            score,
            timeLimit,
            memoryLimit,
            languages,
            testCases,
        });

        return res.status(201).json({
            success: true,
            message: "Problem added successfully",
            problem: newProblem,
        });

    } catch (error) {
        console.error("ADD PROBLEM ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding problem",
        });
    }
};

// ================= Add Testcase =================
const addTestCase = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { testCases } = req.body;

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Testcases must be a non-empty array",
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        problem.testCases.push(...testCases);
        await problem.save();

        return res.status(200).json({
            success: true,
            message: "Testcases added successfully",
            updatedProblem: problem,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error adding testcases",
            error,
        });
    }
};


// ================= Fetch Problems on DataBase =================
const allProblems = async (req, res) => {

    try {
        const problems = await Problem.find({})
            .select("problemNumber title difficulty")
            .sort({ problemNumber: 1 });

        return res
            .status(200)
            .json({
                success: true,
                cout: problems.length,
                problems
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                sucess: false,
                message: "Failed to fetch problems",
                error: error.message,
            })
    }
};

const getSingleProblem = async (req, res) => {

    try {
        const { problemId } = req.params;

        console.log("Problem ID comes", problemId);

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Problem not found",
                });
        }

        console.log("Fetch Problem", problem);

        //separate public testcases

        const publicTestCases = problem.testCases
            .filter(tc => tc.isHidden == false)
            .map(tc => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                explanation: tc.explanation,
            }));

        return res
            .status(200)
            .json({
                success: true,
                problem: {
                    _id: problem._id,
                    problemNumber: problem.problemNumber,
                    title: problem.title,
                    description: problem.description,
                    difficulty: problem.difficulty,
                    constraints: problem.constraints,
                    languages: problem.languages,
                    testCases: publicTestCases,
                    explanation: problem.explanation,
                },
            });
    } catch (error) {
        console.error("GET SINGLE PROBLEM ERROR:", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Server error",
            });
    }

};

export {
    saveCode,
    fetchCode,
    submitCode,
    addProblem,
    addTestCase,
    allProblems,
    getSingleProblem
};
