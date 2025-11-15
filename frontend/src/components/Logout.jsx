import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'


function Logout() {

    const {setIsLoggedIn} = useAuth();

    const handleLogout = async () => {

        try {
            const response = await axios.post("/coding/contest/user/logout",);

            if (response.data.sucess) {
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