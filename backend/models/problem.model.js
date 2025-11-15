import mongoose from 'mongoose'

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
    },
    expectedOutput: {
        type: String,
        required: true,
    }
});

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        eum: ["Easy", "Medium", "Hard"],
        default: "Easy"
    },
    languages: [
        {
            type: String
        }
    ],
    testCases: [testCaseSchema],
}); 

export const Problem = mongoose.model("Problem", problemSchema);