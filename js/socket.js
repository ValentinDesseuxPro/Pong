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
     game.displayPlayers();
     game.moveBall();
      if ( game.ball.inGame ) {
          game.lostBall();
      }
      //game.ai.move();
     game.collideBallWithPlayersAndAction();
     requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
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
    console.log('new Game');
    const message =`Game ID : ${data.roomId} Waiting a second player ...`;
    newPong = new Game(data.roomId);
    newPong.displayGame(message);
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
    game.playerTwo.isSelected=true;
    initialisation();
    newPong = new Game(data.roomId);
    newPong.displayGame('Game Id : '+data.roomId);
});

socket.on('player2', (data) => {
    newPong = new Game(data.roomId);
    newPong.displayGame();
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    initialisation();
});

socket.on('ReadyToPlay',(data)=>{
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