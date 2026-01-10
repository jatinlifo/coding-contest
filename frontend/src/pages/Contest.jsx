import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Contest() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleRegister = () => {
    if (isLoggedIn) {
      navigate('/user/contest/register-contest');
    } else {
      alert('Please login to join the contest');
      navigate('/user/login');
    }
  };

  return (
    <div className="px-6 md:px-12 py-16">

      {/* Page Heading */}
      <h1 className="text-white font-bold text-3xl md:text-4xl text-center mb-12">
        Join Contest
      </h1>

      {/* ===== Single Contest Card ===== */}
      <div className="
        max-w-5xl mx-auto
        bg-gray-800
        rounded-2xl
        overflow-hidden
        flex flex-col md:flex-row
        shadow-lg
      ">

        {/* Left : Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/contest.png"
            alt="Contest"
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* Right : Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          
          <div>
            <h2 className="text-white text-2xl font-bold mb-3">
              Global Weekly Contest
            </h2>

            <p className="text-gray-300 text-base leading-relaxed">
              Participate in this open coding contest and solve DSA problems
              in a competitive environment. You can join anytime and test
              your problem-solving skills against others.
            </p>
          </div>

          <div className="mt-6">
            <button
              className="
                bg-green-600 hover:bg-green-700
                text-white font-semibold
                px-6 py-3
                rounded-full
                transition
              "
              onClick={handleRegister}
            >
              Register
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Contest;
