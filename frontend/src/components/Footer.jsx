import React from 'react'

function Footer() {
    return (
        <div className='fixed left-0 bottom-0 right-0'>
            <div className='bg-gray-600 flex text-white justify-around py-6'>
                <div>logo</div>
                <ul className='flex gap-15'>
                    <li>Home</li>
                    <li>About</li>
                    <li>Contest</li>
                </ul>
                <button>Login</button>
            </div>
        </div>
    )
}

export default Footer