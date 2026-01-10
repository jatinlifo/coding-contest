import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { User } from '../models/user.model.js';

export const verifySocketJWT = async (socket, next) => {

    try {
        //cookies read karo
        const cookies  = cookie.parse(socket.handshake.headers.cookie || "");
        const token = cookies.accessToken;

        if (!token) {
            return next (new Error ("Unauthorized"));
        }

        //token verify
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        //user fetch
        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return next (new Error("User not found"));
        }
        
        socket.user = user;

        next(); // allow connection

    } catch (error) {
        return next(new Error("Socket authentication failed"));
    }
};