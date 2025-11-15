import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const {setIsLoggedIn} = useAuth();
    const {setUserId} = useAuth();

    //navigate the jab cancel pa click kare toh home pa bhej do
    const handleCancel = () => {
        navigate('/')
    }

    // axios.get('/coding/contest/user/refresh-token')
    //   .then((res) => {
    //     console.log("Refresh token")
    //     console.log(res.data)
    //   })
    //   .catch((e)=> {
    //     console.log("Error is ", e);
    //   })

    //check user login
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setMessage("Please enter email and password");
            return;
        }

        console.log("Email: ", email);
        console.log("Password: ", password);

        try {
            const response = await axios.post('/coding/contest/user/login', { email, password });

            if (response.data.sucess) {
                setMessage("Login Sucessfully")
                setIsLoggedIn(true);
                const user = response.data.user
                setUserId(user._id);
                setTimeout(() => {
                    navigate('/user/contest')
                }, 1500)
            } else {
                setMessage("Invalid Credationals")
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Server Error login time")
        }
    };


    return (
        <div className='text-black flex items-center justify-center border-3 min-h-screen
         bg-gray-300 '>
            <div className='bg-white  p-8 rounded-lg shadow-md w-full max-w-sm h-120'>
                <h1 className='text-2xl font-bold mb-5 text-center'>Login page</h1>
                <form onSubmit={handleLogin} className='space-y-8'>
                    <div>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full px-4 py-2 border  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 '
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Enter your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full px-4 py-2 border  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 '
                        />
                    </div>
                    <button
                        type="submit"
                        className='w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-800 transition'
                    >
                        Login
                    </button>
                    <button
                        type='button'
                        onClick={handleCancel}
                        className='bg-gray-200 font-bold px-4 py-2 rounded-full cursor-pointer hover:bg-gray-300'
                    >
                        Cancel

                    </button>
                </form>
                {message && <p className={message === 'Please enter email and password' ?
                    'text-red-500 text-lg font-bold text-center mt-5' : 'text-green-500 text-xl font-bold text-center mt-5'}>
                    {message}</p>}
            </div>
        </div>
    );
}

export default Login