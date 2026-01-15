import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        contestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest",
            required: true,
        },
        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        verdict: {
            type: String,
            enum: ["Accepted", "Wrong Answer", "TLE", "RE"],
            required: true,
        },
        score: {
            type: Number,
            default: 0,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
)

export const Submission = mongoose.model("Submission", submissionSchema);