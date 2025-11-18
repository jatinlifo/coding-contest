import axios from "axios";
import { Code } from "../models/code.model.js";
import { Problem } from "../models/problem.model.js";   // ✅ FIXED (was missing)
import { LeetCode } from "leetcode-query";
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

// ================= Add Problem =================
// const addProblem = async (req, res) => {
//     try {
//         const { title, description, difficulty, languages, testCases } = req.body;

//         const newProblem = new Problem({
//             title,
//             description,
//             difficulty,
//             languages,
//             testCases,
//         });

//         await newProblem.save();

//         return res.status(201).json({
//             success: true,
//             message: "Problem added successfully",
//             problem: newProblem,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Error adding problem",
//             error,
//         });
//     }
// };

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


// ================= Fetch LeetCode Problems =================
const allProblems = async (req, res) => {
    
    
    const lc = new LeetCode();
    try {
        const list = await lc.problems();

        res.status(201).json({
            success: true,
            count: list.length,
            problems: list
        });
        console.log("Problems list", list);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

const getSingleProblem = async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
        return res.status(400).json({
            success: false,
            message: "Slug is required"
        });
    }

    const query = {
        query: `
            query questionData($slug: String!) {
                question(titleSlug: $slug) {
                    questionId
                    title
                    difficulty
                    content
                    exampleTestcases
                }
            }
        `,
        variables: {
            slug: slug
        }
    };

    try {
        const response = await axios.post("https://leetcode.com/graphql", query, {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            }
        });

        const problem = response.data.data.question;

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found on LeetCode"
            });
        }

        return res.status(200).json({
            success: true,
            problem
        });

    } catch (error) {
        console.log("❌ LeetCode Error:");
        console.dir(error.response?.data, { depth: null });

        return res.status(500).json({
            success: false,
            message: "Cannot fetch problem",
            error: error.response?.data || error.message
        });
    }
};

export {
    saveCode,
    fetchCode,
    addTestCase,
    allProblems,
    getSingleProblem
};
