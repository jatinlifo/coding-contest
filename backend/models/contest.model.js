import mongoose from "mongoose";

const contestSchema  = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
    },
    roomCode: {
        type: String,
        required: true,
        unique: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    maxUsers: {
        type: Number,
        required: true,
    },
    contestTime: {
        type: Number,
        required: true,
    },
    participants: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        }
    ],
    status: {
        type: String,
        enum: ["waiting", "running", "ended"],
        default: "waiting",
    },
},{ timestamps: true});

export const Contest = mongoose.model("Contest", contestSchema);