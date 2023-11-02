import React, { useEffect, useState } from 'react'
import './Chatbot.css'
import socket from '../../Socket';


const ChatBot = () => {

    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (userMessage.trim() === '') return;
        setMessages([...messages, { text: userMessage, sender: 'user' }]);
        socket.emit('userMessage', userMessage);
        setUserMessage('');
    };

    useEffect(() => {
        socket.on('botMessage', (message) => {
            setMessages([...messages, { text: message, sender: 'chatbot' }]);
        });
    }, [messages]);
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="chatcontainer">
                    <div className="chatheader">
                        <h1>Chatbot</h1>
                    </div>
                    <div className="chat-messages">
                        <div className='chat-beginner' style={{ minHeight: "200px" }}>
                            {messages.length === 0 && <p>HI, How can I help you?</p>}
                        </div>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`${message.sender === 'user' ? 'user-message' : 'chatbot-message'}`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleMessageSubmit}>
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                            />
                            <button type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ChatBot