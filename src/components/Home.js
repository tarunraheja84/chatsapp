import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

export const socket = io(process.env.REACT_APP_CHATSAPP_SERVER_URI);
export function Home() {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!username.length) toast("Enter username");
        socket.emit('username', username.toLowerCase());
    };

    useEffect(()=>{
        socket.on('username', (user)=>{
            if(user){
                localStorage.setItem('user', user);
                window.open('/chat', "_self");
            }
            else{
                toast("You are not a valid user, Contact Tarun!")
            }
        })

        return () => {
            socket.off('username');
        }
        // eslint-disable-next-line
    }, []) 

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold mb-4 text-center">Enter Your Username</h2>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded outline-none"
                            placeholder="Username"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}