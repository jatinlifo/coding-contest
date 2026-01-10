import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/user/create-account');
  };

  return (
    <div
      className="
        flex flex-col lg:flex-row items-center
        gap-10
        px-6 md:px-12
        py-14 md:py-20
        lg:-mt-20
        min-h-[70vh] md:min-h-[85vh] lg:min-h-screen
        text-white
      "
    >
      {/* Left : Image */}
      <div className="w-full xl:w-1/2 flex justify-center">
        <img
          src="hero.png"
          alt="Coding Contest"
          className="w-full max-w-sm sm:max-w-md xl:max-w-xl rounded-2xl"
        />
      </div>

      {/* Right : Text */}
      <div className="w-full xl:w-1/2">
        
        {/* Heading - center */}
        <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 md:mb-6 text-center xl:text-left">
          Hello Coders! 🚀
        </h1>

        {/* Paragraph - left aligned but centered container */}
        <p className="
          text-lg sm:text-xl xl:text-2xl
          text-gray-300
          leading-relaxed
          mb-8
          text-left
          max-w-2xl
          mx-auto xl:mx-0
        ">
          This platform is built for developers who want to code together in a focused
          and competitive environment. Users can create private coding rooms, invite
          friends, and participate in timed problem-solving sessions. It brings the
          experience of real coding contests into a collaborative space, where learning
          and competition go hand in hand. Whether practicing DSA or competing with
          friends, the goal is to grow skills through shared challenges.
        </p>

        {/* Button */}
        <div className="flex justify-center xl:justify-start">
          <button
            className="bg-blue-500 px-7 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg hover:bg-blue-600 transition"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Hero;
