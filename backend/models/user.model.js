import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
}, {timestamps: true})

//password incrypt kara rahe just save hona saa pahela
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// check password or humna method schema ka andar inject kar diya
userSchema.methods.isPasswordCorrect = async function(password) {
    
    return await bcrypt.compare(password, this.password);
}


//generate access token
userSchema.methods.generateAccessToken = function() {
    
    //syntax ({data},mysecretkey,{expiry})
    const myToken = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
            dob: this.dob,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    console.log("Data base sa access token banaka diye", myToken);
    return myToken
}

//generate refresh token
userSchema.methods.generateRefreshToken = function() {

    const myToken = jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    console.log("Data base na refresh token banaka diye", myToken);
    return myToken;
}

export const User = mongoose.model("User", userSchema);