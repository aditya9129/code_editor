const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { exec } = require("child_process");
const fs = require("fs");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Update the frontend port as per your setup
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const roomChatHistory = {};


function getAllConnectedClients(roomid) {
  const room = io.sockets.adapter.rooms.get(roomid);
  if (!room) return [];

  return Array.from(room).map(socketid => ({
    socketid,
    username: userSocketMap[socketid],
  }));
}

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", ({ roomid, username }) => {
    if (!username) {
      socket.emit("redirect", "/");
      return;
    }
    userSocketMap[socket.id] = username;
    console.log(socket.id)
    socket.join(roomid);
    const clients = getAllConnectedClients(roomid);
    if (roomChatHistory[roomid]) {
      socket.emit("chat_history", roomChatHistory[roomid]);
    }
    clients.forEach(({ socketid }) => {
      io.to(socketid).emit("joined", {
        clients,
        username,
        socketid: socket.id,
      });
    });
  });

  socket.on("runCode", (data) => {
    const { code } = data;

    // Write the code to a temporary file
    const fileName = "tempCode.js"; // Assuming JavaScript code for example
    fs.writeFileSync(fileName, code);

    // Execute the code using Node.js
    exec(`node ${fileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        socket.emit("codeOutput", { output: `Error: ${stderr}` });
        return;
      }
      socket.emit("codeOutput", { output: stdout });

      // Clean up the temporary file
      if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
      } else {
        console.error(`File ${fileName} does not exist.`);
      }
    });
  });

  socket.on("message", ({ username, message, roomid, time, socketid }) => {
    const chatMessage = { username, message, time, socketid };
    console.log(chatMessage);
    // Store the message in chat history
    if (!roomChatHistory[roomid]) {
      roomChatHistory[roomid] = [];
    }
    roomChatHistory[roomid].push(chatMessage);
     io.to(roomid).emit("message", chatMessage);

  });

  socket.on('sync-change', ({ roomid, code }) => {
    console.log(code,roomid);
    io.to(roomid).emit('sync', code );
  });

  socket.on('board-sync', ({ data,roomid}) => {
    
    io.to(roomid).emit('b-sync', data);
  });
  
  socket.on("disconnecting", () => {
    const rooms = socket.rooms;
    rooms.forEach((roomid) => {
      io.to(roomid).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
  });

  socket.on("disconnect", () => {
    delete userSocketMap[socket.id];
    console.log("Client disconnected");
  });
});

app.post("/runCode", (req, res) => {
  const { code } = req.body;

  // For security reasons, never run untrusted code directly like this in a real application.
  exec(`node -e "${code}"`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ output: stderr });
    } else {
      res.status(200).json({ output: stdout });
    }
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const { exec } = require("child_process");
// const fs = require("fs");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:5173", // Update the frontend port as per your setup
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap = {};
// const roomChatHistory = {};
// const roomCodeMap = {}; // Store code for each room

// function getAllConnectedClients(roomid) {
//   return Array.from(io.sockets.adapter.rooms.get(roomid) || []).map(
//     (socketid) => {
//       return {
//         socketid,
//         username: userSocketMap[socketid],
//       };
//     }
//   );
// }

// io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   socket.on("join", ({ roomid, username }) => {
//     if (!username) {
//       socket.emit("redirect", "/");
//       return;
//     }
//     userSocketMap[socket.id] = username;
//     socket.join(roomid);

//     const clients = getAllConnectedClients(roomid);
//     if (roomChatHistory[roomid]) {
//       io.to(socket.id).emit("chat_history", roomChatHistory[roomid]);
//     }

//     if (roomCodeMap[roomid]) {
//       io.to(socket.id).emit("initialCode", { code: roomCodeMap[roomid] });
//     }

//     clients.forEach(({ socketid }) => {
//       io.to(socketid).emit("joined", {
//         clients,
//         username,
//         socketid: socket.id,
//       });
//     });
//   });

//   socket.on("runCode", (data) => {
//     const { code } = data;
//     const fileName = "tempCode.js";
//     fs.writeFileSync(fileName, code);

//     exec(`node ${fileName}`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`exec error: ${error}`);
//         socket.emit("codeOutput", { output: `Error: ${stderr}` });
//         return;
//       }
//       socket.emit("codeOutput", { output: stdout });

//       if (fs.existsSync(fileName)) {
//         fs.unlinkSync(fileName);
//       } else {
//         console.error(`File ${fileName} does not exist.`);
//       }
//     });
//   });

//   socket.on("codeChange", ({ roomid, code }) => {
//     roomCodeMap[roomid] = code;
//     socket.to(roomid).emit("codeChange", { code });
//   });

//   socket.on("message", ({ username, message, roomid, time, socketid }) => {
//     const chatMessage = { username, message, time, socketid };

//     if (!roomChatHistory[roomid]) {
//       roomChatHistory[roomid] = [];
//     }
//     roomChatHistory[roomid].push(chatMessage);
//     io.to(roomid).emit("message", { username, message, time, socketid });
//   });
//   socket.on("board-sync", ({ data, roomid }) => {
//     io.to(roomid).emit("b-sync", data);
//   });

//   socket.on("disconnecting", () => {
//     const rooms = [...socket.rooms];
//     rooms.forEach((roomid) => {
//       socket.in(roomid).emit("disconnected", {
//         socketId: socket.id,
//         username: userSocketMap[socket.id],
//       });
//     });
//   });

//   socket.on("disconnect", () => {
//     delete userSocketMap[socket.id];
//     console.log("Client disconnected");
//   });
// });

// const port = 5000;
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
