import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CreateAccount() {

    const [fullname, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    //click cancel redirect home page
    const handleCancel = () => {
        navigate('/')
    }
    //direct login kara route pa jao
    const handleCreateAccount = async (e) => {
        e.preventDefault();

        if (!email || !password || !fullname || !dob) {
            setMessage("All fields are required please enter");
            return;
        }
        console.log("Fullname:", fullname)
        console.log("DOB", dob)
        console.log("Email: ", email);
        console.log("Password: ", password);

        try {
            const response = await axios.post('/coding/contest/user/create-account', { fullname, dob, email, password });

            if (response.data.sucess) {
                setMessage("Create Account Sucessfully")
                setTimeout(() => {
                    navigate('/contest');
                }, 1500)
            } else {
                setMessage("Invalid Credationals")
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Server Error")
        }
    };


    return (
        <div className='text-black flex items-center justify-center  min-h-screen
         bg-gray-300 '>
            <div className='bg-white p-8 mb-16 rounded-lg shadow-md w-full max-w-sm'>
                <h1 className='text-2xl font-bold mb-5 text-center'>Create Your Account</h1>
                <form onSubmit={handleCreateAccount} className='space-y-8'>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullname}
                            onChange={(e) => setFullName(e.target.value)}
                            className='w-full px-4 py-2 border  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 '
                        />
                    </div>
                    <div>
                        <h1 className='px-4'>Enter your Date of Birth</h1>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className='w-full px-4 py-2 border  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 '
                        />
                    </div>
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
                            placeholder="Create your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full px-4 py-2 border  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 '
                        />
                    </div>
                    <input
                        type="password"
                        placeholder="Confirm your Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full px-4 py-2 border  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 '
                    />
                    <button
                        type="submit"
                        className='w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-800 transition'
                    >
                        Create Account
                    </button>
                    <button
                        type="button"
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

export default CreateAccount;