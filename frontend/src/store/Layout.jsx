import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';




function Layout() {
    const location = useLocation();
    const {isLoggedIn, setIsLoggedIn} = useAuth();

    // const showHero = location.pathname === '/';

    
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.post("/coding/contest/user/refresh-token",{}, {
          withCredentials: true,
        });
        if (res.data.sucess) {
          console.log(res.data)
          setIsLoggedIn(true);
        } else {
          console.log(res.data);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.log("ERROR request gai he nahi", err);
        setIsLoggedIn(false);
      }
    };

   checkAuth();
  }, []);

   

    return (
        <>
         <Navbar />
         {/* {showHero && <Hero />} */}
         
         <main className='p-6'>
            <Outlet />
         </main>
         <Footer />
        </>
    )
}

export default Layout