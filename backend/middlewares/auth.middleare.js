import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res
            .status(401)
            .json({ sucess: false, message: "Unauthorized request" })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return res
            .status(401)
            .json({ sucess: false, message: "Invalid access Token" })
        }
        req.user = user
        next()
    } catch (error) {
        return res
        .status(401)
        .json(
        {
            sucess: false,
            message: error?.message || "Invalid access token"
        })
    }
};


// Only Admin
// export const isAdmin = (req, res, next) => {
    
//     if (req.user.role != "admin") {
//         return res
//         .status(403)
//         .json({
//             sucess: false,
//             message: "Access denied"
//         });
//     }
    // next();
// }