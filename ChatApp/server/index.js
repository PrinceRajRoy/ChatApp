const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./routes/router");
const cors = require("cors");
const { addUser, removeUser, getUser, getUsers } = require('./helpers/users');

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
   console.log("We Have A New Connection!!");

   socket.on("join", ({ name, room }, callback) => {

       const { error, user } = addUser({ id: socket.id, name, room});

       if(error) return callback({ error: 'error'});

       socket.emit("message", { user: "admin", text: `${user.name}, welcome to the room ${user.room}`});
       socket.broadcast.to(user.room).emit('message', { user: "admin", text: `${user.name} has joined the chat`});

       socket.join(user.room);

       io.emit("roomData", { room: user.room, users: getUsers(user.room) });

       callback();
   });

   socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", { user: user.name, text: message });
        io.to(user.room).emit("roomData", { room: user.room, users: getUsers(user.room) });

        callback();
   });

   socket.on("disconnect", () => {
       const user = removeUser(socket.id);
       if(user) {
           io.to(user.room).emit("message", { user: "admin", text: `${user.name} has left the chat.` });
       }
   }) 
});

app.use(router);
app.use(cors);

server.listen(PORT, () => {
    console.log(`Server Running On Port: ${PORT}`);
});