import React from 'react';

function ChatMessage({ message }) {
  const renderUser = () => {
    if (message.role === 'Owner') {
      return (
        <span style={{ color: 'red' }}>
          Owner {message.user}:
        </span>
      );
    } else if (message.role === 'Admin') {
      return (
        <span style={{ color: 'blue' }}>
          Admin {message.user}:
        </span>
      );
    } else if (message.role === 'Prob hackerman') {
      return (
        <span style={{ color: 'orange' }}>
          Prob hackerman {message.user}:
        </span>
      );
    } else {
      return (
        <span>
          {message.user}:
        </span>
      );
    }
  };


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
    return formattedTime;
  };

  return (
    <div className="chat-message">
      {formatTimestamp(message.timestamp)} {renderUser()} {message.message}
    </div>
  );
}

export default ChatMessage;
