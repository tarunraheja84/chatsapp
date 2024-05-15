import React, { useState, useEffect, useRef } from 'react';
import { formatDateString } from '../helperFunctions';
import { socket } from './Home';
import { toast } from 'react-toastify';

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const page = useRef(1);
  const hasMore = useRef(true);
  const scrollableDivRef = useRef();
  const lastMessageRef = useRef(null);

  const fetchMoreData = () => {

    if (!hasMore.current || scrollableDivRef.current.scrollTop) return;

    socket.emit('loadMore', page.current + 1);
    socket.on('moreMessages', (moreMessages) => {
      if (!moreMessages.length) {
        hasMore.current = false;
      }
      else {
        page.current = page.current + 1;
        setChat(prevChat => [...moreMessages, ...prevChat]);
      }
    });

  };



  const sendMessage = (e) => {
    e.preventDefault();

    if (message.length) {
      socket.emit('message', { user: localStorage.getItem('user'), message: message });
      setMessage('');
    }
  };



  useEffect(() => {
    socket.on('start', (initialMessages) => {
      setChat(initialMessages);
      setTimeout(() => {
        if (scrollableDivRef.current) {
          scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
        }
      }, 0);
    });

    socket.on('message', (newMessage) => {
      setChat(prevChat => [...prevChat, newMessage]);
      setTimeout(() => {
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    });

    socket.emit('start');

    if (scrollableDivRef.current)
      scrollableDivRef.current.addEventListener('scroll', fetchMoreData);

    toast(`Welcome ${localStorage.getItem('user')}!`);

    return () => {
      socket.off('start');
      socket.off('message');
    };
  }, []);


  return (
    <div className="relative h-14 bg-white w-full p-4 pt-2 shadow-lg rounded-lg">
        <div className="absolute text-xs top-1 right-1">By Tarun</div>
      <div className="mb-4 sticky">
        <h1 className="text-2xl font-bold text-center text-blue-500">ChatsApp</h1>
      </div>
      <div
        id="scrollableDiv"
        ref={scrollableDivRef}
        className="mb-4 h-[calc(100vh-144px)] overflow-y-auto"
      >
        {chat.map((msg, index) => (
          <div key={index}
            ref={index === chat.length - 1 ? lastMessageRef : null} // Set ref to the last message
            className={`flex mb-2 ${localStorage.getItem('user') === msg.user ? "" : "justify-end"}`}>
            <div
              className="flex flex-col w-2/3 bg-gray-200 rounded-md mt-2"
            >
              {!(localStorage.getItem('user') === msg.user) && <div className="text-blue-500 font-bold px-1 pt-1 rounded text-xs flex justify-end">
                {msg.user}
              </div>}
              <div className="px-2 rounded break-all">
                {msg.message}
              </div>
              <div className="text-xs flex justify-end p-1">
                {formatDateString(msg.timestamp.toString())}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <form onSubmit={sendMessage} className="flex h-12">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow min-w-screen-md w-[80vw] p-2 border border-gray-300 rounded-l outline-none"
            placeholder="Type a message"
            autoFocus
          />
          <button type="submit" className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
