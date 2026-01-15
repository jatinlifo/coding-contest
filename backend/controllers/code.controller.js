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
        const { problemId, contestId, code, language, userId } = req.body;

        if (!problemId || !contestId || !code || !language || !userId) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Missing fields",
                });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Problem not found",
                });
        }

        // Check All testacases (Public + hidden)
        const allTestCases = problem.testCases.map((tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
        })));

        //Call judge
        const judgeRes = await axios.post(
            "http://localhost:8000/api/judge/submit",
            {
                code,
                language,
                testCases: allTestCases,
                timeLimit: problem.timeLimit,
                memoryLimit: problem.memoryLimit,
            }
        );

        const results = judgeRes.data.results;

        //final verdict
        let verdict = "Accepted";

        for (const r of results) {
            if (r.status !== "AC") {
                verdict = r.status;
                break;
            }
        }

        // ======= SCORE LOGIC ============
        const score = verdict === "Accepted" ? problem.score : 0;

        // ========= save submission ==========

        await Submission.create({
            contestId,
            problemId,
            userId,
            verdict,
            score,
        });

        return res.status(200)
            .json({
                success: true,
                verdict,
                score,
                results,
            });
    } catch (error) {
        console.error("SUBMIT ERROR:", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Submission failed",
            })
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
