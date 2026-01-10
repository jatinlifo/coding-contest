import React from "react";
import { Link } from "react-router-dom";
import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter } from "react-icons/ai";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6 md:px-12">
      
      {/* ===== TOP SECTION ===== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12">
        
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            CodeRoom
          </h2>
          <p className="text-sm leading-relaxed">
            A collaborative coding platform where developers create rooms,
            solve DSA problems together, and compete in real-time coding contests.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/user/contest" className="hover:text-white transition">
                Contests
              </Link>
            </li>
            <li>
              <Link to="/user/about" className="hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/user/create-account" className="hover:text-white transition">
                Create Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Community
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Discussions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Leaderboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Social / Legal */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Connect
          </h3>

          {/* Social Icons */}
          <div className="flex gap-4 mb-6">
            <a
              href="#"
              className="text-2xl hover:text-white transition"
            >
              <AiFillGithub />
            </a>
            <a
              href="#"
              className="text-2xl hover:text-white transition"
            >
              <AiFillLinkedin />
            </a>
            <a
              href="#"
              className="text-2xl hover:text-white transition"
            >
              <AiOutlineTwitter />
            </a>
          </div>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="#" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CodeRoom. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
