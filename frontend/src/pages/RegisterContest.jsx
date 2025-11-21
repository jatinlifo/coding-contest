import React from 'react'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOwnerName } from '../context/OwnerContext'


function RegisterContest() {

    const [ownerName, setOwnerName] = useState("")
    const [numerOfUser, setNumberOfUser] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const {setIsLoggedIn} = useAuth();
    const {toggleDetails} = useOwnerName();

    //navigate the jab cancel pa click kare toh home pa bhej do
    const handleCancel = () => {
        navigate('/')
    }

    const handleRegisterContest =  (e) => {
        e.preventDefault();

        if (!ownerName || !numerOfUser) {
            setMessage("Please full fill the details");
            return;
        }
        
        toggleDetails(ownerName, numerOfUser);
        setOwnerName(ownerName);
        setNumberOfUser(numerOfUser);

        navigate('/user/contest/register-contest/select-problems', {
            state: {ownerName, numerOfUser}
        })
    };


    return (
        <div className='text-black flex items-center justify-center border-3 min-h-screen
         bg-gray-300 '>
            <div className='bg-white  p-8 rounded-lg shadow-md w-full max-w-sm h-120'>
                <h1 className='text-2xl font-bold mb-5 text-center'>Register Contest</h1>
                <form onSubmit={handleRegisterContest} className='space-y-8'>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter your room name"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className='w-full px-4 py-2 border  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 '
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="how many people to join your contest"
                            value={numerOfUser}
                            onChange={(e) => setNumberOfUser(e.target.value)}
                            className='w-full px-4 py-2 border  rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 '
                        />
                    </div>
                    <button
                        type="sumbit"
                        className='w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-800 transition'
                    >
                        Register Contest
                    </button>
                    <button
                        type='button'
                        onClick={handleCancel}
                        className='bg-gray-200 font-bold px-4 py-2 rounded-full cursor-pointer hover:bg-gray-300'
                    >
                        Cancel

                    </button>
                </form>
                {message && <p className={message === 'Please full fill the details' ?
                    'text-red-500 text-lg font-bold text-center mt-5' : 'text-green-500 text-xl font-bold text-center mt-5'}>
                    {message}</p>}
            </div>
        </div>
    );
}

export default RegisterContest 