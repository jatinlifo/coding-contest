import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';

function Contest() {

  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();

  const handlRegister = () => {

    if (isLoggedIn === true) {
      navigate('/user/contest/register-contest')
    } else {
      alert("Please login")
      navigate('/')
    }
  }

  return (
    <>
      <div className=''>
        <h1 className='text-white font-bold text-4xl text-center mb-8'>
          Join Contest</h1>
        <div className='flex items-center justify-center gap-3 w-full'>
          <div className='w-130 px-3 py-4 bg-gray-600'>

            <div className='rounded-xl overflow-hidden'>
              <img src="/hero.avif"
                alt="hero"
                className='object-cover'
              />
            </div>
            <div className='flex justify-between'>
              <div>
                <h1 className='text-white text-lg font-bold'>Global Weekly Contest</h1>
                <p className='text-white'>Sunday 8 am to 10 am</p>
              </div>
              <button
                className='text-white font-bold px-4 py-1 mt-2 
                rounded-full bg-green-600 cursor-pointer hover:bg-green-700'
                onClick={handlRegister}
              >
                Register
              </button>
            </div>
          </div>
          <div className='w-130 px-3 py-4 bg-gray-600'>

            <div className='rounded-xl overflow-hidden'>
              <img src="/hero.avif"
                alt=""
                className='object-cover'
              />
            </div>
            <div className='flex justify-between'>
              <div>
                <h1 className='text-white text-lg font-bold'>Global Weekly Contest</h1>
                <p className='text-white'>Sunday 8 am to 10 am</p>
              </div>
              <button
                className='text-white font-bold px-4 py-1 mt-2 
                      rounded-full bg-green-600 cursor-pointer hover:bg-green-700'
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contest;