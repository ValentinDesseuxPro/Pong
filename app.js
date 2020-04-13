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

// Quand un client se connecte
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
    })
    
    
    socket.on('moving', (data)=>{
        if(data.player==='player1'){
            socket.broadcast.to(data.roomId).emit('player1move', {posY : data.posY});
        }else if(data.player==='player2'){
            socket.broadcast.to(data.roomId).emit('player2move', {posY : data.posY});
        }
    });

    socket.on('ball', (data)=>{
        socket.broadcast.to(data.roomId).emit('ballmove', {position : {posX : data.position.posX, posY : data.position.posY}});
    });

    socket.on('score', (data)=>{
        socket.broadcast.to(data.roomId).emit('scoreUpdate', {player : data.player ,score :{player1 : data.score.player1, player2 : data.score.player2}});
    })

    socket.on('ready', (data)=>{
        socket.broadcast.to(data.roomId).emit('playerReady',{player : data.player});
    });

    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });


});



server.listen(port);