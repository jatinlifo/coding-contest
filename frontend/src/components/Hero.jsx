import React, { useState } from 'react'
// import CreateAccount from './CreateAccount'
import { useNavigate } from 'react-router-dom';

function Hero() {
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const navigate = useNavigate();

    const hadleCreateAccountClose = ()=> {
        setShowCreateAccount(false);
        navigate('/user/contest')

    }

    
    // move navigate create account
    const handleCreateAccount = () => {
        navigate('/user/create-account')  
    }
    return (
        <div className='flex py-5 px-10 gap-5 text-white'>
            <div className='w-1/2'>
                <img src="hero.avif" alt="hero" />
            </div>
            <div className='w-1/2'>
                <h1 className='text-3xl'>Hello coders!</h1>
                <p className='text-3xl'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                Quod doloremque cupiditate, eligendi dolores hic eveniet omnis accusantium, 
                architecto molestiae perferendis accusamus tenetur vitae!</p>
                <button
                className=' bg-blue-500 text-white px-5 py-2 rounded-full
                 hover:bg-blue-800 transition mt-30 ml-4 '
                 onClick={() => handleCreateAccount()}
                 onClose={hadleCreateAccountClose}
                >
                Creare Account
                </button>
                {/* {showCreateAccount && <CreateAccount onClose={hadleCreateAccountClose} />} */}
            </div>
        </div>
    )
}

export default Hero