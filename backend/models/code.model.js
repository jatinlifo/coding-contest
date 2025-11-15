import mongoose, {Schema} from 'mongoose'


const codeSchema = new Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // connected with your existing users collection
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: "Untitled",     
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
    }
}, {timestamps: true})

export const Code = mongoose.model("Code", codeSchema);