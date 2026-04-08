import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios';
import { socket } from '../socket';


function Logout() {

    const {setIsLoggedIn} = useAuth();

    const handleLogout = async () => {

        try {
            const response = await api.post("/coding/contest/user/logout",);

            if (response.data.sucess) {
                localStorage.removeItem("socketToken");
                socket.disconnect();
                console.log("User logged out successfully")
                setIsLoggedIn(false);
            } else {
                console.log("Logut failed:", response.data.message);
            }
        } catch (error) {
            console.log("Logout error: ", error)
        }
    };

    return handleLogout;
}

export default Logout;