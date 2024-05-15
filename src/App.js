import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './components/Chat';
import { Home } from './components/Home';
import { ToastContainer, Zoom } from 'react-toastify';

function App() {
  return (
    <Router>
      <ToastContainer 
                  autoClose={2000} 
                  hideProgressBar={true} 
                  transition={Zoom} 
                  position="top-center"
                  theme="dark"
                />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
    </Router>
  );
}

export default App;
