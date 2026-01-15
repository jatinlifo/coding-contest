import mongoose from 'mongoose'

const testCaseSchema = new mongoose.Schema({
    input: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    expectedOutput: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    explanation: {
        type: String,
        default: "",
    },
    isHidden: {
        type: Boolean,
        default: true,
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
    constraints: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    timeLimit: {
        type: Number, // milliseconds
        default: 1000
    },
    memoryLimit: {
        type: Number, // Mb
        default: 256
    },
    languages: {
            type: [String],
            enum: ["cpp", "java", "python", "c", "javascript",],
            required: true
    },
    testCases: {
        type: [testCaseSchema],
        validate: [
            v => v.length > 0,
            "At least one test case is required"
        ]
    },
    // isActive: {
     // type: Boolean,
    //     default: true,
    // }
}, {timestamps: true}); 


export const Problem = mongoose.model("Problem", problemSchema);