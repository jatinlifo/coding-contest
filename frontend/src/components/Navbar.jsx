import React from 'react'
import Login from './Login'
import { useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import Logout from './Logout';



function Navbar() {

    const { isLoggedIn } = useAuth()
    const navigate = useNavigate();

    //state to control mobile menu open/close
    const [menuOpen, setMenuOpen] = useState(false);

    //navigate the login page
    const handleLogin = () => {
        navigate('/user/login', {
            state: {redirectTo: "/user/contest"}
        });
    }
    //navigate the profile page
    const handleProfile = () => {
        navigate('/user/profile')
    }

    //navigate home page bcz logout
    const handleLogout = Logout()

    return (
        <nav className='relative bg-gray-900 text-white px-4 md:px-20 py-4 md:py-6 font-bold'>
            {/* Top Bar  */}
            <div className='flex items-center justify-between'>
                {/* LOGO  */}
                <div className='font-bold text-xl'>logo</div>
                {/* Desktop Menu  */}
                <ul className='hidden md:flex gap-6 font-bold'>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/user/about">About</Link></li>
                    <li><Link to="/user/contest">Contest</Link></li>
                </ul>

                {/* Desktop Right Section / */}
                <div className='hidden md:flex items-center gap-4'>
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
                    {/* Profile icon only when logged in  */}
                    {isLoggedIn && (
                        <div className='px-2 py-2 text-gray-700 text-2xl
                    bg-gray-100 rounded-full cursor-pointer'
                            onClick={() => handleProfile()}
                        >
                            <AiOutlineUser />
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button  */}
                <button
                    className='md:hidden text-2xl'
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                </button>
            </div>

            {/* Mobile Dropdown Menu  */}
            {menuOpen && (
                <ul className="absolute top-full left-0 w-full bg-gray-900 flex flex-col items-start gap-4 py-4 px-4 md:hidden">

                    <li className='w-full'>
                        <Link to="/" onClick={() => setMenuOpen(false)} className='block w-full px-6 py-3'>
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/user/about" onClick={() => setMenuOpen(false)} className='block w-full px-6 py-3' >
                            About
                        </Link>
                    </li>

                    <li>
                        <Link to="/user/contest" onClick={() => setMenuOpen(false)} className='block w-full px-6 py-3'>
                            Contest
                        </Link>
                    </li>

                    {!isLoggedIn ? (
                        <button
                            className="bg-blue-500 px-6 py-2 rounded-full w-full text-left hover:bg-blue-600 "
                            onClick={() => {
                                handleLogin();
                                setMenuOpen(false);
                            }}
                        >
                            Login
                        </button>
                    ) : (
                        <>
                            <button
                                className="bg-blue-500 px-6 py-2 rounded-full w-full text-left hover:bg-blue-600"
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                            >
                                Logout
                            </button>

                            <button
                                className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-800"
                                onClick={() => {
                                    handleProfile();
                                    setMenuOpen(false);
                                }}
                            >
                                <AiOutlineUser />
                                Profile
                            </button>
                        </>
                    )}
                </ul>
            )}
        </nav>
    )
}

export default Navbar