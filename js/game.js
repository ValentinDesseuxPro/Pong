var game = {
    groundWidth : 700,
    groundHeight : 400,
    groundColor: "#000000",
    netWidth : 6,
    netColor: "#FFFFFF",
    groundLayer : null,  
    scoreLayer : null,
    playersBallLayer : null,
   
    groundLayer : null,
    scorePosPlayer1 : 300,
    scorePosPlayer2 : 365,

    wallSound : null,
    playerSound : null,
    divGame : null,
    gameOn : false,
    startGameButton : null,
    beginingP1 : false,
    beginingP2 : false, 

    ball : {
        width : 10,
        height : 10,
        color : "#FFFFFF",
        posX : 200,
        posY : 200,
        speed : 1,
        inGame : false,
        directionX : 1,
        directionY : 1,

        move : function() {
            if ( this.inGame ) {
                this.posX += this.directionX * this.speed;
                this.posY += this.directionY * this.speed;
            }
          },
        
          bounce : function(soundToPlay) {
            if ( this.posX > game.groundWidth || this.posX < 0 ) {
              this.directionX = -this.directionX;
              soundToPlay.play();
            }
            if ( this.posY > game.groundHeight || this.posY < 0  ) {
              this.directionY = -this.directionY;
              soundToPlay.play();
            }    
          },

        collide : function(anotherItem) {
            if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
                || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height ) ) {
              // Collision
              return true;
            } 
            return false;
          },

          lost : function(player) {
            var returnValue = false;
            if ( player.originalPosition == "left" && this.posX < player.posX - this.width ) {
              returnValue = true;
            } else if ( player.originalPosition == "right" && this.posX > player.posX + player.width ) {
              returnValue = true;
            }
            return returnValue;
          },

          speedUp: function() {
            this.speed = this.speed + .1;
          },
      },

      playerOne : {
        width : 10,
        height : 50,
        color : "#FFFFFF",
        posX : 30,
        posY : 175,
        goUp : false,
        goDown : false,
        originalPosition : "left",
        score : 0,
        ai : false,
        isSelected : false,
        amI : false,
        engaging : true,
      },
        
      playerTwo : {
        width : 10,
        height : 50,
        color : "#FFFFFF",
        posX : 650,
        posY : 175,
        goUp : false,
        goDown : false,
        originalPosition : "right",
        score : 0,
        ai : false,
        isSelected : false,
        amI : false,
        engaging : false,
      },
   
    init : function() {
      this.divGame = document.getElementById("divGame");
      this.startGameButton = document.getElementById("startGame");

      this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, this.divGame, 0, "#000000", 250, 150); 
      game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);

      this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, this.divGame, 1, undefined, 250, 150);
      //game.display.drawTextInLayer(this.scoreLayer, "SCORE", "10px Arial", "#FF0000", 10, 10);

      this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, this.divGame, 2, undefined, 250, 150);
      //game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);

      this.displayScore(0,0);
      this.displayBall();
      this.displayPlayers();

      this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
      //this.initMouse(game.control.onMouseMove);
      this.checkIfBothPlayers();

      this.wallSound = new Audio("./sound/pingMur.ogg");
      this.playerSound = new Audio("./sound/pingRaquette.ogg");

      game.speedUpBall();

      //game.ai.setPlayerAndBall(this.playerTwo, this.ball);
    },

    initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
       window.onkeydown = onKeyDownFunction;
       window.onkeyup = onKeyUpFunction;
    },

    initMouse : function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },

    displayScore : function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);   
    },

    displayBall : function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    },

    displayPlayers : function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
      },

    moveBall : function() { 
       this.ball.move();
       this.ball.bounce(this.wallSound);
       this.displayBall();
    },

    movePlayers : function() {
        if ( game.control.controlSystem == "KEYBOARD" ) {
          // keyboard control
          if(game.playerOne.amI){
            if ( game.playerOne.goUp && game.playerOne.posY > 0) {
              game.playerOne.posY-=5;
            } else if ( game.playerOne.goDown && game.playerOne.posY < game.groundHeight - game.playerOne.height) {
              game.playerOne.posY+=5;
            }
          }
          else if(game.playerTwo.amI){
            if ( game.playerTwo.goUp && game.playerTwo.posY > 0) {
              game.playerTwo.posY-=5;
            } else if ( game.playerTwo.goDown && game.playerTwo.posY < game.groundHeight - game.playerTwo.height) {
              game.playerTwo.posY+=5;
            }
          }
        } else if ( game.control.controlSystem == "MOUSE" ) {
          // mouse control
          if(game.playerOne.amI){
            if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer && game.playerOne.posY > 0)
              game.playerOne.posY-=5;
            else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer && game.playerOne.posY < game.groundHeight - game.playerOne.height)
              game.playerOne.posY+=5;
            }
          else if(game.playerTwo.amI){
            if (game.playerTwo.goUp && game.playerTwo.posY > game.control.mousePointer && game.playerTwo.posY > 0)
              game.playerTwo.posY-=5;
            else if (game.playerTwo.goDown && game.playerTwo.posY < game.control.mousePointer && game.playerTwo.posY < game.groundHeight - game.playerTwo.height)
              game.playerTwo.posY+=5;
          }
          }

      },


    clearLayer : function(targetLayer) {
       targetLayer.clear();
    },

    collideBallWithPlayersAndAction : function() { 
        if ( this.ball.collide(game.playerOne) ) {
            this.changeBallPath(game.playerOne, game.ball);
          this.playerSound.play();
        }
        if ( this.ball.collide(game.playerTwo) ) {
            this.changeBallPath(game.playerTwo, game.ball);
          this.playerSound.play();
        }
      },

    lostBall : function() {
    if ( this.ball.lost(this.playerOne) ) {
      this.playerTwo.score++;
      this.playerOne.engaging = true;
      if ( this.playerTwo.score > 4 ) {
        this.playerTwo.score = 'V';
        this.gameOn = false;
        this.ball.inGame = false;
        document.getElementById('messageWaiting').textContent='Click Ready to restart a game';
        document.getElementById('messageWaiting').style.display='block';
      } else {
        this.ball.inGame = false;
     
        if ( this.playerOne.ai ) { 
          setTimeout(game.ai.startBall(), 3000);
        }
      }
    } else if ( this.ball.lost(this.playerTwo) ) {
      this.playerTwo.engaging = true;
      this.playerOne.score++;
      if ( this.playerOne.score > 4 ) {
        this.playerOne.score = 'V';
        this.gameOn = false;
        this.ball.inGame = false;
        document.getElementById('messageWaiting').textContent='Click Ready to restart a game';
        document.getElementById('messageWaiting').style.display='block';
      } else {
        this.ball.inGame = false;
 
        if ( this.playerTwo.ai ) { 
          setTimeout(game.ai.startBall(), 3000);
        }
      }
    }
   
    this.scoreLayer.clear();
    this.displayScore(this.playerOne.score, this.playerTwo.score);
  },


  ballOnPlayer : function(player, ball) {
    var returnValue = "CENTER";
    var playerPositions = player.height/5;
    if ( ball.posY > player.posY && ball.posY < player.posY + playerPositions ) {
      returnValue = "TOP";
    } else if ( ball.posY >= player.posY + playerPositions && ball.posY < player.posY + playerPositions*2 ) {
      returnValue = "MIDDLETOP";
    } else if ( ball.posY >= player.posY + playerPositions*2 && ball.posY < player.posY + 
      player.height - playerPositions ) {
      returnValue = "MIDDLEBOTTOM";
    } else if ( ball.posY >= player.posY + player.height - playerPositions && ball.posY < player.posY + 
      player.height ) {
      returnValue = "BOTTOM";
    }
    return returnValue;
  },

      initStartGameButton : function() {
        this.startGameButton.onclick = game.control.onStartGameClickButton;
      },

      reinitGame : function() {
        this.ball.inGame = false;
        this.ball.posX = 200;
        this.ball.posY = 200;
        this.ball.speed = 1;
        this.playerOne.score = 0;
        this.playerOne.posY = 175;
        this.playerTwo.posY = 175;
        this.playerTwo.score = 0;
        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score);
      },

      changeBallPath : function(player, ball) {
        if ( player.originalPosition == "left" ) {
          switch( game.ballOnPlayer(player, ball) ) {
            case "TOP":
              ball.directionX = 1;
              ball.directionY = -3;
              break;
            case "MIDDLETOP":
              ball.directionX = 1;
              ball.directionY = -1;
              break;
            case "CENTER":
              ball.directionX = 2;
              ball.directionY = 0;
              break;
            case "MIDDLEBOTTOM":
              ball.directionX = 1;
              ball.directionY = 1;
              break;
            case "BOTTOM":
              ball.directionX = 1;
              ball.directionY = 3;
              break;
          }
      } else {
          switch( game.ballOnPlayer(player, ball) ) {
            case "TOP":
              ball.directionX = -1;
              ball.directionY = -3;
              break;
            case "MIDDLETOP":
              ball.directionX = -1;
              ball.directionY = -1;
              break;
            case "CENTER":
              ball.directionX = -2;
              ball.directionY = 0;
              break;
            case "MIDDLEBOTTOM":
              ball.directionX = -1;
              ball.directionY = 1;
              break;
            case "BOTTOM":
              ball.directionX = -1;
              ball.directionY = 3;
              break;
          }
        }
    },

    speedUpBall: function() { 
        setInterval(function() {
        game.ball.speedUp();
      }, 10000);
      },

    checkIfBothPlayers(){
      if(this.playerOne.isSelected && this.playerTwo.isSelected){
        document.getElementById("startGame").disabled=false;
        this.initStartGameButton();
      }
      else document.getElementById("startGame").disabled=true;
    }
   
  };
