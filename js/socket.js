(function () {
    var requestAnimId;
    var initialisation = function () {
      // le code de l'initialisation
        game.init();
        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
      
    }

    var main = function () {
     // le code du jeu
     readyCheck();
     game.clearLayer(game.playersBallLayer);
     game.movePlayers();
     sendPosition();
     game.displayPlayers();
     game.moveBall();
     ballPosition();
      if ( game.ball.inGame ) {
          game.lostBall();
          scoreCheck();
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
    if(game.ball.inGame)
        socket.emit('ball', {roomId :this.newPong.getGameId(), position : {posX : game.ball.posX, posY : game.ball.posY}});
    }

    var scoreCheck = function(){
        if(game.ball.lost(game.playerOne))
            socket.emit('score',{roomId : this.newPong.getGameId(), player : 'player1', score :{player1 : game.playerOne.score, player2 : game.playerTwo.score}});
        else if(game.ball.lost(game.playerTwo))
            socket.emit('score',{roomId : this.newPong.getGameId(), player : 'player2', score :{player1 : game.playerOne.score, player2 : game.playerTwo.score}});
    }

    var readyCheck = function(){
        if(game.beginingP1 && !game.gameOn){
            socket.emit('ready',{roomId : this.newPong.getGameId(),player : 'player1'});
        }
        if(game.beginingP2 && !game.gameOn){
            socket.emit('ready',{roomId : this.newPong.getGameId(),player : 'player2'});
        }
        
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
        game.ball.posX=data.position.posX;
        game.ball.posY=data.position.posY;
});

socket.on('scoreUpdate',(data)=>{
    if(data.player==='player1')game.playerOne.engaging=true;
    else if(data.player==='player2')game.playerTwo.engaging=true;
    game.playerOne.score=data.score.player1;
    game.playerTwo.score=data.score.player2;
    game.scoreLayer.clear();
    game.displayScore(game.playerOne.score,game.playerTwo.score);
    if(game.playerOne.amI && (game.playerOne.score==='V' || game.playerTwo.score==='V')){
        game.gameOn=false;
        document.getElementById('messageWaiting').textContent='Click Ready to restart a game';
        document.getElementById('messageWaiting').style.display='block';
    }
    else if(game.playerTwo.amI && (game.playerOne.score==='V' || game.playerTwo.score==='V')){
        game.gameOn=false;
        document.getElementById('messageWaiting').textContent='Click Ready to restart a game';
        document.getElementById('messageWaiting').style.display='block';
    }
});

socket.on('playerReady',(data)=>{
    if(data.player==='player1')game.beginingP1=true;
    if(data.player==='player2')game.beginingP2=true;
    if( !game.gameOn && game.beginingP1 && game.beginingP2) {
        document.getElementById('messageWaiting').textContent='';
        document.getElementById('messageWaiting').style.display='none';
        game.reinitGame();
        game.gameOn = true;
        game.beginingP1=false;
        game.beginingP2=false;
      }

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