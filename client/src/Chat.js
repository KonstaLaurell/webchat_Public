// Chat.js
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from "axios";
import './Chat.css';
import ChatMessage from './ChatMessage';

const Chat = ({ token, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const [amount, setAmount] = useState(null);
  const [showShoutBox, setShowShoutBox] = useState(false);
  const [shoutBoxMessage, setShoutBoxMessage] = useState('');
  const [shoutuser, setShoutuser] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    socket.emit('chat message', { message: newMessage, token: token });
    setNewMessage('');
  };

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('chat message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('chat history', (history) => {
        setMessages(history.reverse());
      });

      socket.on("user amount", (amount) => {
        setAmount(amount);
      });

      socket.on("shout", (shout) => {
        setShoutuser(shout.user);
        setShoutBoxMessage(shout.message);
        setShowShoutBox(true);
        setTimeout(() => {
          setShowShoutBox(false);
        }, 5000);
      });

      socket.emit('get messages');
    }

    return () => {
      if (socket) {
        socket.off('chat message');
        socket.off('chat history');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-container">
      {showShoutBox && (
        <div className="shout">
          <div className="shout-name">{shoutuser}</div>
          <div className="shout-text">{shoutBoxMessage}</div>
        </div>
      )}
      <div className="chat-header">
        <h1>Chat</h1>
        <h1>Online: {amount}</h1>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          className="chat-input"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="chat-button"
          onClick={sendMessage}
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
