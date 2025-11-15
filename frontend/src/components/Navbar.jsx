import React from 'react'
import Login from './Login'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import Logout from './Logout';



function Navbar() {

    const {isLoggedIn} = useAuth()
    const navigate = useNavigate();

    //navigate the login page
    const handleLogin = () => {
        navigate('/user/login')
    }
    //navigate the profile page
    const handleProfile = () => {
        navigate('/user/profile')
    }

    //navigate home page bcz logout
    const handleLogout = Logout()

    return (
        <div>
            <div className='bg-gray-600 flex text-white justify-around py-6'>
                <div>logo</div>
                <ul className='flex gap-15'>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/user/about">About</Link></li>
                    <li><Link to="/user/contest">Contest</Link></li>
                </ul>
                {!isLoggedIn ? (
                    <button
                        className=' bg-blue-500 text-white py-2 px-5 rounded-full
                        hover:bg-blue-800 transition'
                        onClick={() => handleLogin()}
                    >
                        Login
                    </button>
                ) : (
                    <button
                        className=' bg-blue-500 text-white py-2 px-5 rounded-full
                    hover:bg-blue-800 transition'
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}
                <div className='px-1.5 text-gray-700  py-1.5 text-3xl
                    bg-gray-100 rounded-full cursor-pointer'
                    onClick={() => handleProfile()}
                >
                    <AiOutlineUser />
                </div>
            </div>
        </div>
    )
}

export default Navbar