import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="text-white">

      {/* ===== ABOUT HERO ===== */}
      <section className="px-6 md:px-12 py-20 bg-gray-900 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          About CodeRoom
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          CodeRoom is a collaborative coding platform designed to help developers
          practice, compete, and grow together through real-time coding rooms.
        </p>
      </section>

      {/* ===== WHAT IS CODEROOM ===== */}
      <section className="px-6 md:px-12 py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What is CodeRoom?
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              CodeRoom allows developers to create private coding rooms where
              friends or teammates can join and solve DSA problems together.
              Each room runs in a timed environment, simulating real coding
              contests while maintaining a collaborative experience.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8">
            <ul className="space-y-4 text-gray-300">
              <li>✔ Create your own coding room</li>
              <li>✔ Invite friends via room link</li>
              <li>✔ Solve problems together</li>
              <li>✔ View rankings after contest</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-6 md:px-12 py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Login</h3>
              <p className="text-gray-300">
                Sign in to your account to get started.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Create Room</h3>
              <p className="text-gray-300">
                Set participants, problems, and contest time.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Invite & Code</h3>
              <p className="text-gray-300">
                Share the room link and solve together.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">View Ranking</h3>
              <p className="text-gray-300">
                Rankings are generated after the contest ends.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="px-6 md:px-12 py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose CodeRoom?
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Unlike traditional coding platforms, CodeRoom focuses on
              collaboration and competition together. It helps developers
              practice under real contest conditions while learning from peers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-xl">Real-time contests</div>
            <div className="bg-gray-900 p-6 rounded-xl">DSA focused</div>
            <div className="bg-gray-900 p-6 rounded-xl">Private rooms</div>
            <div className="bg-gray-900 p-6 rounded-xl">Live rankings</div>
          </div>

        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-6 md:px-12 py-20 bg-gray-900 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Coding Together?
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          Create your first coding room and challenge your friends today.
        </p>
        <button
          className="bg-blue-500 px-8 py-4 rounded-full text-lg hover:bg-blue-600 transition"
          onClick={() => navigate("/user/create-account")}
        >
          Get Started
        </button>
      </section>

    </div>
  );
}

export default About;
