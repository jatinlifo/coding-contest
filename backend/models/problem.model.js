import mongoose from 'mongoose'

const testCaseSchema = new mongoose.Schema({
    input: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    expectedOutput: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
});

const problemSchema = new mongoose.Schema({
    problemNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
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