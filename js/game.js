var game = {
  groundWidth : 700,
  groundHeight : 400,
  groundColor: "#000000",
  netWidth : 6,
  netColor: "#FFFFFF",
  groundLayer : null,  
  scoreLayer : null,
  playersBallLayer : null,
  iaGame : false,
  iaGameFinish : false,
  oneVSone : false,
  twoVStwo : false,
 
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
  beginingP3 : false,
  beginingP4 : false,

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
      color : "#0093fe",
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
      ready : false,
    },
      
    playerTwo : {
      width : 10,
      height : 50,
      color : "#bf0000",
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
      ready : false,
    },

    playerThree : {
      width : 10,
      height : 50,
      color : "yellow",
      posX : 175,
      posY : 175,
      goUp : false,
      goDown : false,
      originalPosition : "left",
      score : 0,
      ai : false,
      isSelected : false,
      amI : false,
      engaging : true,
      ready : false,
    },

    playerFour : {
      width : 10,
      height : 50,
      color : "#75a10a",
      posX : 525,
      posY : 175,
      goUp : false,
      goDown : false,
      originalPosition : "right",
      score : 0,
      ai : false,
      isSelected : false,
      amI : false,
      engaging : false,
      ready : false,
    },
 
  init : function() {
    this.divGame = document.getElementById("divGame");
    this.startGameButton = document.getElementById("startGame");

    this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, this.divGame, 0, "#000000", 0, 0); 
    game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);

    this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, this.divGame, 1, undefined, 0, 0);
    
    this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, this.divGame, 2, undefined, 0, 0);
    
    this.displayScore(0,0);
    this.displayBall();
    if(this.twoVStwo){
      this.playerOne.posY=100-(this.playerOne.height/2);
      this.playerThree.posY=300-(this.playerThree.height/2);
      this.playerTwo.posY=300-(this.playerTwo.height/2);
      this.playerFour.posY=100-(this.playerFour.height/2);
    }
    this.displayPlayers();

    this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
    //this.initMouse(game.control.onMouseMove);
    if(!this.iaGame)
    this.checkIfBothPlayers();
    if(this.iaGame){
    game.ai.setPlayerAndBall(this.playerTwo, this.ball);
    this.initStartGameButton();
    }

    this.wallSound = new Audio("./sound/pingMur.ogg");
    this.playerSound = new Audio("./sound/pingRaquette.ogg");

    game.speedUpBall();

    
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
      if(!game.twoVStwo){
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
      }else{
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerThree.width, this.playerThree.height, this.playerThree.color, this.playerThree.posX, this.playerThree.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerFour.width, this.playerFour.height, this.playerFour.color, this.playerFour.posX, this.playerFour.posY);
      }
    },

  moveBall : function() { 
     this.ball.move();
     this.ball.bounce(this.wallSound);
     this.displayBall();
  },

  movePlayers : function() {

    if(!game.twoVStwo){
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

        }else{
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
            else if(game.playerThree.amI){
              if ( game.playerThree.goUp && game.playerThree.posY > 0) {
                game.playerThree.posY-=5;
              } else if ( game.playerThree.goDown && game.playerThree.posY < game.groundHeight - game.playerThree.height) {
                game.playerThree.posY+=5;
              }
            }
            else if(game.playerFour.amI){
              if ( game.playerFour.goUp && game.playerFour.posY > 0) {
                game.playerFour.posY-=5;
              } else if ( game.playerFour.goDown && game.playerFour.posY < game.groundHeight - game.playerFour.height) {
                game.playerFour.posY+=5;
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
            }else if(game.playerThree.amI){
              if (game.playerThree.goUp && game.playerThree.posY > game.control.mousePointer && game.playerThree.posY > 0)
                game.playerThree.posY-=5;
              else if (game.playerThree.goDown && game.playerThree.posY < game.control.mousePointer && game.playerThree.posY < game.groundHeight - game.playerThree.height)
                game.playerThree.posY+=5;
            }else if(game.playerFour.amI){
              if (game.playerFour.goUp && game.playerFour.posY > game.control.mousePointer && game.playerFour.posY > 0)
                game.playerFour.posY-=5;
              else if (game.playerFour.goDown && game.playerFour.posY < game.control.mousePointer && game.playerFour.posY < game.groundHeight - game.playerFour.height)
                game.playerFour.posY+=5;
            }
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
      if(this.twoVStwo){
        if ( this.ball.collide(game.playerThree) ) {
          if(this.ball.directionX<0){
            this.changeBallPath(game.playerThree, game.ball);
            this.playerSound.play();
          }
        }
        if ( this.ball.collide(game.playerFour) ) {
          if(this.ball.directionX>0){
            this.changeBallPath(game.playerFour, game.ball);
            this.playerSound.play();
          }
        }
      }
    },

  lostBall : function() {
  if ( this.ball.lost(this.playerOne) ) {
    this.playerTwo.score++;
    this.playerOne.engaging = true;
    if(this.twoVStwo)this.playerThree.engaging=true;
    if ( this.playerTwo.score > 4 ) {
      this.playerOne.ready=false;
      this.playerTwo.ready=false;
      this.beginingP1=false;
      this.beginingP2=false;
      if(this.twoVStwo){
        this.playerThree.ready=false;
        this.playerFour.ready=false;
        this.beginingP3=false;
        this.beginingP4=false;
      }
      this.playerTwo.score = 'V';
      this.gameOn = false;
      this.iaGameFinish=true;
      this.ball.inGame = false;
      document.getElementById('messageWaiting').textContent='Click Ready to restart a game !';
      document.getElementById('messageWaiting').style.display='block';
      document.getElementById('startGame').disabled=false;
    } else {
      this.ball.inGame = false;
   
      if ( this.playerOne.ai ) { 
        setTimeout(game.ai.startBall(), 3000);
      }
    }
  } else if ( this.ball.lost(this.playerTwo) ) {
    this.playerTwo.engaging = true;
    this.playerOne.score++;
    if(this.twoVStwo)this.playerFour.engaging=true;
    if ( this.playerOne.score > 4 ) {
      this.playerOne.ready=false;
      this.playerTwo.ready=false;
      this.beginingP1=false;
      this.beginingP2=false;
      if(this.twoVStwo){
        this.playerThree.ready=false;
        this.playerFour.ready=false;
        this.beginingP3=false;
        this.beginingP4=false;
      }
      this.playerOne.score = 'V';
      this.gameOn = false;
      this.iaGameFinish=true;
      this.ball.inGame = false;
      document.getElementById('messageWaiting').textContent='Click Ready to restart a game !';
      document.getElementById('messageWaiting').style.display='block';
      document.getElementById('startGame').disabled=false;
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
      if(!this.twoVStwo){
        this.playerOne.posY = 175;
        this.playerTwo.posY = 175;
        this.playerThree.engaging=true;
        this.playerFour.engaging=false;
      }else{
        this.playerOne.posY=100-(this.playerOne.height/2);
        this.playerThree.posY=300-(this.playerThree.height/2);
        this.playerTwo.posY=300-(this.playerTwo.height/2);
        this.playerFour.posY=100-(this.playerFour.height/2);
      }
      this.playerTwo.score = 0;
      this.scoreLayer.clear();
      this.playerOne.engaging=true;
      this.playerTwo.engaging=false;
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