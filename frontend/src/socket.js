import { io } from 'socket.io-client'

const backendURL = "https://coding-contest-8pre.onrender.com";

// export const socket = io("http://localhost:8001", {
//     withCredentials: true, // cookies ke liya
// })

export const socket = io(backendURL, {
    withCredentials: true, // cookies ke liya
     transports: ["websocket"],
})