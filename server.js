const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
const roomChatHistory = {};
function getAllConnectedClients(roomid) {
    return Array.from(io.sockets.adapter.rooms.get(roomid) || []).map((socketid) => {
        return {
            socketid,
            username: userSocketMap[socketid],
        };
    });
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('join', ({ roomid, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomid);
        const clients = getAllConnectedClients(roomid);
        if (roomChatHistory[roomid]) {
            io.to(socket.id).emit('chat_history', roomChatHistory[roomid]);
        }
        clients.forEach(({ socketid }) => {
            io.to(socketid).emit('joined', {
                clients,
                username,
                socketid: socket.id,
            });
        });
    });

    socket.on('message', ({ username, message, roomid }) => {
        const chatMessage = { username, message };

        // Store the message in chat history
        if (!roomChatHistory[roomid]) {
            roomChatHistory[roomid] = [];
        }
        roomChatHistory[roomid].push(chatMessage);
        io.to(roomid).emit('message', { username, message });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomid) => {
            socket.in(roomid).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
    });

    socket.on('disconnect', () => {
        delete userSocketMap[socket.id];
        console.log('socket disconnected', socket.id);
    });
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});
