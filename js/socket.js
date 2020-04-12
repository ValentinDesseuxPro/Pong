(function () {
    var requestAnimId;
    var initialisation = function () {
      // le code de l'initialisation
        game.init();
        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
      
    }

    var main = function () {
     // le code du jeu
     game.clearLayer(game.playersBallLayer);
     game.movePlayers();
     sendPosition();
     game.displayPlayers();
     game.moveBall();
     ballPosition();
      if ( game.ball.inGame ) {
          game.lostBall();
      }
      //game.ai.move();
     game.collideBallWithPlayersAndAction();
     requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
   }

   var sendPosition = function(){
    if ( game.playerOne.goDown || game.playerOne.goUp) socket.emit('moving', { roomId : this.newPong.getGameId(),player : 'player1' ,posY : game.playerOne.posY});
    else if ( game.playerTwo.goDown || game.playerTwo.goUp) socket.emit('moving', {roomId : this.newPong.getGameId(), player : 'player2' ,posY : game.playerTwo.posY});
    }

    var ballPosition = function(){
        socket.emit('ball', {roomId :this.newPong.getGameId(), position : {posX : game.ball.posX, posY : game.ball.posY}});
    }

   let pong = game;
   let newPong;
   let player;
   let socket = io();

   //creation du joueur 1 de gauche
   document.getElementById('createGame').onclick = ()=> {
    socket.emit('createNewGame', {});
    player = new Player('left');
};

// Creation de la partie par P1
socket.on('newGame', (data) => {
    const message =`Game ID : ${data.roomId} Waiting a second player ...`;
    this.newPong = new Game(data.roomId);
    this.newPong.displayGame(message);
    game.playerOne.isSelected=true;
});

//rejoindre une partie 
document.getElementById('joinGame').onclick = () => {
    const roomID = document.getElementById('RoomName').value;
    if (!roomID) {
        alert('Please enter the name of the game.');
        return;
    }
    socket.emit('joinGame', {roomId: roomID });
    player = new Player('right');
};


socket.on('player1', (data) => {
    game.playerOne.amI=true;
    game.playerTwo.isSelected=true;
    initialisation();
    //newPong = new Game(data.roomId);
    this.newPong.displayGame('Game Id : '+data.roomId);
});

socket.on('player2', (data) => {
    this.newPong = new Game(data.roomId);
    this.newPong.displayGame('Game Id : '+data.roomId);
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerTwo.amI=true;
    initialisation();
});

socket.on('player1move',(data)=>{
    if(game.playerTwo.amI)game.playerOne.posY=data.posY;
});

socket.on('player2move',(data)=>{
    if(game.playerOne.amI)game.playerTwo.posY=data.posY;
});

socket.on('ballmove',(data)=>{
    //if(game.ball.inGame){
        game.ball.posX=data.position.posX;
        game.ball.posY=data.position.posY;
    //}
});

socket.on('err', (data) => {
    alert(data.message);
    location.reload();
});

   class Game {
    constructor(roomId) {
        this.roomId = roomId;
    }
    displayGame(message) {
        document.getElementById('menu').style.display='none';
        document.getElementById('completGame').style.display='block';
        document.getElementById('message').textContent=message;
    }
    getGameId(){
        return this.roomId;
    }
}

class Player {
    constructor(position) {
        this.position = position;
    }
    getPlayerPosition() {
        return this.position;
    }
}

}());