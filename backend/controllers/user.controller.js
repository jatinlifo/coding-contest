import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

//cokkies options
const optionsAccessToken = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000
}

const optionsRefreshToken = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000
}


//function generate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId)

        const accessToken =  user.generateAccessToken(); 
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        console.log(`I am access token ${accessToken} and \n`)
        console.log("I am refresh token ", refreshToken);

        return { accessToken, refreshToken }

        
    } catch (error) {
        return new Error(500, "Something went wrong while generating access and refresh token")
    }
}

const createAccountUser = async (req, res) => {

    const { fullname, dob, email, password } = req.body;
    console.log("fullname:", fullname);
    console.log("dob:", dob);
    console.log("email", email);
    console.log("password", password);

    //check all fields
    if (fullname?.trim() === "" ||
        dob?.trim() === "" ||
        email?.trim() === "" ||
        password?.trim() === "") {
        return res
            .status(400)
            .json({ sucess: false, message: "All fields are required" })
    }

    //call data base user exist toh nahi hai
    const existedUser = await User.findOne({
        $or: [{ fullname }, { email }]
    })

    if (existedUser) {
        return res
            .status(409)
            .json({ sucess: false, message: "This username email are already exists" })
    }

    // password crypt
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 = salt rounds
    // console.log("I am crypt password:",hashedPassword)

    //entry the data on DATABASE
    const user = await User.create({
        fullname: fullname,
        dob: dob,
        email: email, 
        password: hashedPassword
    })

    //DB sa data select
    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        return res
            .status(500)
            .json({
                sucess: false,
                message: "Something went wrong on find time"
            })
    }

    return res
        .status(201)
        .json({
            sucess: true,
            message: "Account created sucessfully",
            user: createdUser
        });

}

const loginUser = async (req, res) => {

    const { email, password } = req.body;
    console.log("Email is ", email);
    console.log("Password is ", password);

    if (!email && !password) {
        return res
            .status(400)
            .json({
                sucess: false,
                message: "Email and password are required"
            });
    }

    //check user exist or not
    const user = await User.findOne({ email });
    console.log("Data Base email ", user.email);
    console.log("Data Base password", user.password);

    if (!user) {
        return res
            .status(404)
            .json({ sucess: false, message: "User not found" })
    }

    //compare password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res
            .status(401)
            .json({ sucess: false, message: "Invalid password" });
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    console.log("access token", accessToken);
    console.log("refresh token", refreshToken);

    //sending user info without password
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");;

    //send sucesss response  
    return res
        .status(200)
        .cookie("accessToken",  accessToken, optionsAccessToken)  
        .cookie("refreshToken", refreshToken, optionsRefreshToken)  
        .json({
            sucess: true,
            message: "User login sucessfullly",
            user: loggedInUser,
        });
}

const logoutUser = async (req, res) => {

   try {
     await User.findByIdAndUpdate(
         req.user._id,
         {
             $unset: {
                 refreshToken: 1
             }
         },
         {
             new: true 
         }
     );
 
     console.log("Request comes to logout function")
     return res
     .status(200)
     .clearCookie("accessToken", optionsAccessToken)
     .clearCookie("refreshToken", optionsRefreshToken)
     .json({sucess: true, message: "User logged Out"})
   } catch (error) {
      console.log("Logout error: ", error);
      res
      .status(500)
      .json({sucess: false,message: "Logout Failed"})
   }
}



//access the token jo user already login hai
const refreshAccessToken = async (req, res) => {
    
    console.log("HEADERS:", req.headers);
    console.log("COOKIES:", req.cookies);
    const incomingRefreshToken = req.cookies.refreshToken
    // const incomingAccessToken = req.cookies.accessToken   || req.body.accessToken;
    
    // console.log("INCOMING ACCESS TOKEN", incomingAccessToken)
    console.log("INCOMING REFRESH TOKEN",incomingRefreshToken)

    if (!incomingRefreshToken) {
        return res
        .status(401)
        .json({sucess: false, message:"Unauthorized request time to access refresh token"})
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            return res
            .status(401)
            .json({sucess: false, message: "Invalid refresh token time to access id throw refresh token"})
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res
            .status(401)
            .json({sucess: false, message: "Refresh token is expire or used"})
        }

        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        console.log("New access token", newAccessToken);
        console.log("New Refresh token", newRefreshToken);

        return res
        .status(200)
        .cookie("accessToken", newAccessToken, optionsAccessToken)
        .cookie("refreshToken", newRefreshToken, optionsRefreshToken)
        .json(
            {
                sucess: true,
                message: "Access token refreshed generte new tokens"
            }
        )

    } catch (error) {
        return res
        .status(401)
        .json({sucess: true, message: "Invalid refresh token time to access refresh token"})
    }
}

export {
    createAccountUser,
    loginUser,
    logoutUser,
    refreshAccessToken

}