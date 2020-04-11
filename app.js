const express  = require('express');
const app      = express();
const path = require('path');
const port = 8080;
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('dotenv-flow').config();
app.use(express.static('.'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

let roomName = 0;

// Quand un client se connecte, on le note dans la console
io.on('connection', function (socket) {
    socket.on('createNewGame',()=>{
        this.roomName = ++roomName;
        socket.join(`room-`+roomName);
        socket.emit('newGame', { roomId : `room-${roomName}` });
    })
    
    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on('joinGame', function (data) {
        let room = io.nsps['/'].adapter.rooms[data.roomId];
        if (room && room.length === 1) {
            socket.join(data.roomId);
            socket.broadcast.to(data.roomId).emit('player1', {roomId : data.roomId});
            socket.emit('player2', {roomId: data.roomId})
        } else {
            socket.emit('err', { message: 'Partie en cours !' });
        }
    });


    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });


});



server.listen(port);