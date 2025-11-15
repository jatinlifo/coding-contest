import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';

function Token() {

    return (
        <div>
            <button className='px-3 y-2 bg-yellow-500'
                onClick={async () => {

                    try {
                        const res = await axios.post(
                            "/coding/contest/user/refresh-token" // relative path → proxy kaam karega
                             // cookie / credentials send karne ke liye
                        );
                        console.log("✅ Refresh token response:", res.data);
                    } catch (err) {
                        console.log("❌ Error refreshing token:", err);
                    }
                }}

            >
                Refresh Token</button>
        </div>
    )
}

export default Token