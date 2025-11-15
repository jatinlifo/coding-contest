import { Code } from "../models/code.model.js";
import { Problem } from "../models/problem.model.js";

const saveCode = (req, res) => {

    const {userId, title, language, code} = req.body;

    const user = Code.create({
        userId: userId,
        title: title,
        language: language,
        code: code,
    })

    return res
    .status(201)
    .json({
        sucess: true,
        message: "Code save Successfully",
        user: user
    })
};


// ================ Data Base sa code fetch kar ra hai ===========
const fetchCode = async (req, res) => {

    const {userId, title} = req.body;
    if (!userId || !title) {
        return res
        .status(501)
        .json({
            sucess: false,
            message: "This id is not exist my data base"
        })
    }

    const user = Code.findById(userId);

    
    return res
    .status(201)
    .json({
        sucess: true,
        message: "This user is exist my data base",
        code : user.code,
        language: user.language,
    })
}

const addProblem = async (req, res) => {

    try {
        const {title, description, difficulty, languages, testCases} = req.body
        
        const newProblem = new Problem({
            title,
            description,
            difficulty,
            languages,
            testCases,
        });

        await newProblem.save();

        res
        .status(201)
        .json({
            sucess: true,
            message: "Problem added successfully!",
            problem: newProblem,
        })
        
    } catch (error) {
        res
        .status(500)
        .json({
            sucess: true,
            message: "Error problem add time",
            Error: error
        })
    }
}

const addTestCase = async (req, res) => {

    try {
        const {problemId} = req.params;
        const {testCases} = req.body;

        //Validation
        if (!Array.isArray(testCases) || testCases.length === 0) {
            return res
            .status(400)
            .json({
                sucess: true,
                message: "TestCase must be a non-empty array"
            })
        }

        //Find problem
        const problem = await Problem.findById(problemId)

        if (!problem) {
            return res
            .status(404)
            .json({
                sucess: false,
                message: "Problem not found"
            })
        }

        problem.testCases.push(...testCases);
        await problem.save();

        res
        .status(200)
        .json({
            sucess: true,
            message: "Testcases added successfully",
            updatedProblem: problem,
        })
    } catch (error) {
        res
        .status(500)
        .json({
            sucess: false,
            message: "Error time to add TestCases",
            Error : error
        })
    }
}

const allProblems = async (re, res) => {

    try {
        const problems = await Problem.find({}, "title difficulty _id");
        //only some fields 

        res.status(200)
        .json({
            sucess: true,
            message: "All Problems fetched sucessfully",
            problems,
        })
    } catch (error) {
        res
        .status(500)
        .json({
            sucess: false,
            message: "Problem not found time to print all problem",
            Error: error
        })
    }
}

export  {
    saveCode,
    fetchCode,
    addProblem,
    addTestCase,
    allProblems
}