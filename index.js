
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let port = 3000;

let users = {};

io.on('connection',socket =>{
    
    socket.on('new-user-join',(Name) =>{
        console.log("new user joined", Name)
        users[socket.id] = Name ;
        socket.broadcast.emit('user-joined',Name);
    });

    socket.on('send',(message) =>{
        socket.broadcast.emit('receive',{message: message , Name : users[socket.id]})
    });

    socket.on('disconnect',message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
})

app.use(express.static('public'))

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });