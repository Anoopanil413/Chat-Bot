import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 


socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('botMessage', (message) => {
    console.log('Chatbot message:', message);
});

export default socket;
