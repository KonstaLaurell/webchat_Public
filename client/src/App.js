import { io } from 'socket.io-client';
import axios from "axios";
import Footer from "./footer"
import React, { useEffect, useState, useRef } from 'react';
import Chat from './Chat';
import Login from './Logins';
import Register from './Register';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./Topbar.css"
import "./ChatGameLayout.css";
import "./App.css"
function App() {
  const [socket, setSocket] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const peer = useRef();

  const handleLogin = () => {
    setLoggedIn(true);
    window.location.href = "/";
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, []);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      return;
    }

    const newSocket = io('https://api.tyhjyys.fun/', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: {
        token: token,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);



  return (
    <div className="App">
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {!loggedIn && (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            {loggedIn && (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>

        <div className="ChatGameContainer">
          
            <Routes>
              <Route
                exact
                path="/"
                element={loggedIn ? <div><div className="ChatContainer"><Chat socket={socket} token={token} /></div></div> : <Login onLogin={handleLogin} />}
              />
              <Route exact path="/login" element={<Login token={token} socket={socket} onLogin={handleLogin} />} />
              <Route exact path="/register" element={<Register />} />
            </Routes>
          <Footer />
        </div>
      </Router>
      
    </div>
  );
}

export default App;
