(function () {
    var requestAnimId;
    var initialisation = function () {
      // le code de l'initialisation
        game.init();
        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
      
    }

    var main = function () {
     // le code du jeu
     if(!game.iaGame)
     readyCheck();
     game.clearLayer(game.playersBallLayer);
     game.movePlayers();
     if(!game.iaGame)
     sendPosition();
     game.displayPlayers();
     game.moveBall();
     if(!game.iaGame)
     ballPosition();
      if ( game.ball.inGame ) {
          game.lostBall();
          if(!game.iaGame)
          scoreCheck();
      }
      if(game.iaGame)
      game.ai.move();
     game.collideBallWithPlayersAndAction();
     requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
   }

   var sendPosition = function(){
    if ( game.playerOne.goDown || game.playerOne.goUp) socket.emit('moving', { roomId : this.newPong.getGameId(),player : 'player1' ,posY : game.playerOne.posY});
    else if ( game.playerTwo.goDown || game.playerTwo.goUp) socket.emit('moving', {roomId : this.newPong.getGameId(), player : 'player2' ,posY : game.playerTwo.posY});
    else if ( game.playerThree.goDown || game.playerThree.goUp) socket.emit('moving', {roomId : this.newPong.getGameId(), player : 'player3' ,posY : game.playerThree.posY});
    else if ( game.playerFour.goDown || game.playerFour.goUp) socket.emit('moving', {roomId : this.newPong.getGameId(), player : 'player4' ,posY : game.playerFour.posY});
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
        if(!game.twoVStwo){
            if(game.beginingP1 && !game.playerOne.ready && game.playerOne.amI){
                socket.emit('ready',{roomId : this.newPong.getGameId(),player : 'player1'});
                game.playerOne.ready=true;
            }
            if(game.beginingP2 && !game.playerTwo.ready  && game.playerTwo.amI){
                socket.emit('ready',{roomId : this.newPong.getGameId(),player : 'player2'});
                game.playerTwo.ready=true;
            }
        }else{
            if(game.beginingP1 && !game.playerOne.ready && game.playerOne.amI){
                socket.emit('ready',{roomId : this.newPong.getGameId(),player : 'player1'});
                game.playerOne.ready=true;
            }
            if(game.beginingP2 && !game.playerTwo.ready  && game.playerTwo.amI){
                socket.emit('ready',{roomId : this.newPong.getGameId(),player : 'player2'});
                game.playerTwo.ready=true;
            }
            if(game.beginingP3 && !game.playerThree.ready  && game.playerThree.amI){
                socket.emit('ready',{roomId : this.newPong.getGameId(),player : 'player3'});
                game.playerThree.ready=true;
            }
            if(game.beginingP4 && !game.playerFour.ready  && game.playerFour.amI){
                socket.emit('ready',{roomId : this.newPong.getGameId(),player : 'player4'});
                game.playerFour.ready=true;
            }
        }
        
    }

    
   let pong = game;
   let newPong;
   let player;
   let socket = io();

   //creation du joueur 1 de gauche
   document.getElementById('createGame').onclick = ()=> {
    //game.oneVSone=true;
    socket.emit('createNewGame', {nbPlayer : 2});
    //player = new Player('left');
};

    document.getElementById('createGameIA').onclick = ()=>{
        game.iaGame=true;
        game.playerOne.amI=true;
        document.getElementById('menu').style.display='none';
        document.getElementById('completGame').style.display='block';
        document.getElementById('startGame').disabled=false;
        document.getElementById('message').textContent='Enjoy your game !'
        initialisation();
    };

document.getElementById('createGame2vs2').onclick = ()=>{
    game.twoVStwo = true;
    socket.emit('createNewGame', {nbPlayer : 4});
};

// Creation de la partie par P1
socket.on('newGame', (data) => {
    let message;
    if(!game.twoVStwo)
        message =`Game ID : ${data.roomId} ! Waiting a second player ...`;
    else{ 
        message = `Game ID : ${data.roomId} ! Waiting other players ...`;
        game.playerOne.amI=true;
    }
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
    if(!game.twoVStwo){
        socket.emit('joinGame', {roomId: roomID, places : 2});
        //player = new Player('right');
    }
    else{
        socket.emit('joinGame', {roomId: roomID, places : 4});
    }
    
};


socket.on('player1', (data) => {
    game.playerOne.amI=true;
    game.playerTwo.isSelected=true;
    initialisation();
    this.newPong.displayGame('Game Id : '+data.roomId);
});

socket.on('newPlayer',(data)=>{
    if(data.player==2)game.playerTwo.isSelected=true;
    else if(data.player==3)game.playerThree.isSelected=true;
    else if(data.player==4){
        game.playerFour.isSelected=true;
        initialisation();
        this.newPong.displayGame('Game Id : '+data.roomId);
    }
});

socket.on('player2', (data) => {
    this.newPong = new Game(data.roomId);
    this.newPong.displayGame('Game Id : '+data.roomId);
    document.getElementById('startGame').disabled=false;
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerTwo.amI=true;
    initialisation();
});

socket.on('2V2player2', (data) => {
    this.newPong = new Game(data.roomId);
    this.newPong.displayGame(`Game ID : ${data.roomId} ! Waiting other players ...`);
    //document.getElementById('startGame').disabled=false;
    game.twoVStwo=true;
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerTwo.amI=true;
});

socket.on('2V2player3',(data)=>{
    this.newPong = new Game(data.roomId);
    this.newPong.displayGame(`Game ID : ${data.roomId} ! Waiting other players ...`);
    //document.getElementById('startGame').disabled=false;
    game.twoVStwo=true;
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerThree.isSelected=true;
    game.playerThree.amI=true;

});

socket.on('2V2player4',(data)=>{
    this.newPong = new Game(data.roomId);
    this.newPong.displayGame('Game Id : '+data.roomId);
    document.getElementById('startGame').disabled=false;
    game.twoVStwo=true;
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerThree.isSelected=true;
    game.playerFour.isSelected=true;
    game.playerFour.amI=true;
    initialisation();

});

socket.on('player1move',(data)=>{
    if(game.playerTwo.amI || game.playerThree.amI || game.playerFour.amI)game.playerOne.posY=data.posY;
});

socket.on('player2move',(data)=>{
    if(game.playerOne.amI || game.playerThree.amI || game.playerFour.amI)game.playerTwo.posY=data.posY;
});

socket.on('player3move',(data)=>{
    if(game.playerOne.amI || game.playerTwo.amI || game.playerFour.amI)game.playerThree.posY=data.posY;
});

socket.on('player4move',(data)=>{
    if(game.playerOne.amI || game.playerTwo.amI || game.playerThree.amI)game.playerFour.posY=data.posY;
});

socket.on('ballmove',(data)=>{
        game.ball.posX=data.position.posX;
        game.ball.posY=data.position.posY;
});

socket.on('scoreUpdate',(data)=>{
    if(data.player==='player1'){
        game.playerOne.engaging=true;
        if(game.twoVStwo)game.playerThree.engaging=true;
    }
    else if(data.player==='player2'){
       game.playerTwo.engaging=true;
       if(game.twoVStwo)game.playerFour.engaging=true;
    }
    game.playerOne.score=data.score.player1;
    game.playerTwo.score=data.score.player2;
    game.scoreLayer.clear();
    game.displayScore(game.playerOne.score,game.playerTwo.score);
    if((game.playerOne.amI || game.playerThree.amI) && (game.playerOne.score==='V' || game.playerTwo.score==='V')){
        game.gameOn=false;
        document.getElementById('messageWaiting').textContent='Click Ready to restart a game !';
        document.getElementById('messageWaiting').style.display='block';
        document.getElementById('startGame').disabled=false;
        game.playerOne.ready=false;
        game.playerTwo.ready=false;
        if(game.twoVStwo){
            game.playerThree.ready=false;
            game.playerFour.ready=false;
            game.beginingP3=false;
            game.beginingP4=false;
        }
        game.beginingP1=false;
        game.beginingP2=false;
    }
    else if((game.playerTwo.amI || game.playerFour.amI) && (game.playerOne.score==='V' || game.playerTwo.score==='V')){
        game.gameOn=false;
        document.getElementById('messageWaiting').textContent='Click Ready to restart a game !';
        document.getElementById('messageWaiting').style.display='block';
        document.getElementById('startGame').disabled=false;
        game.playerOne.ready=false;
        game.playerTwo.ready=false;
        if(game.twoVStwo){
            game.playerThree.ready=false;
            game.playerFour.ready=false;
            game.beginingP3=false;
            game.beginingP4=false;
        }
        game.beginingP1=false;
        game.beginingP2=false;
    }
});

socket.on('playerReady',(data)=>{
    if(!game.twoVStwo){
        if(data.player==='player1')game.beginingP1=true;
        if(data.player==='player2')game.beginingP2=true;
        if(game.beginingP1 && game.beginingP2) {
            document.getElementById('messageWaiting').textContent='';
            document.getElementById('messageWaiting').style.display='none';
            document.getElementById('startGame').disabled=true;
            game.reinitGame();
            game.gameOn = true;
            game.beginingP1=false;
            game.beginingP2=false;
        }
    }else{
        if(data.player==='player1')game.beginingP1=true;
        if(data.player==='player2')game.beginingP2=true;
        if(data.player==='player3')game.beginingP3=true;
        if(data.player==='player4')game.beginingP4=true;
        if(game.beginingP1 && game.beginingP2 && game.beginingP3 && game.beginingP4) {
            document.getElementById('messageWaiting').textContent='';
            document.getElementById('messageWaiting').style.display='none';
            document.getElementById('startGame').disabled=true;
            game.reinitGame();
            game.gameOn = true;
            game.beginingP1=false;
            game.beginingP2=false;
            game.beginingP3=false;
            game.beginingP4=false;
        }
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