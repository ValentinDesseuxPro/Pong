game.control = {

  mousePointer : null,
  controlSystem : null,
 
  onKeyDown : function(event) {
 
      game.control.controlSystem = "KEYBOARD";

      
   
        if ( event.keyCode == game.keycode.KEYDOWN && game.gameOn) { 
          if(game.playerOne.amI){
            game.playerOne.goDown = true;
            game.playerOne.goUp = false;
          }else if(game.playerTwo.amI){
            game.playerTwo.goDown = true;
            game.playerTwo.goUp = false;
          }

          if(game.twoVStwo){
            if(game.playerThree.amI){
              game.playerThree.goDown = true;
              game.playerThree.goUp = false;
            }else if(game.playerFour.amI){
              game.playerFour.goDown = true;
              game.playerFour.goUp = false;
            }
          }


        } else if ( event.keyCode == game.keycode.KEYUP && game.gameOn) { 
          if(game.playerOne.amI){
            game.playerOne.goUp = true;
            game.playerOne.goDown = false;
          }else if(game.playerTwo.amI){
            game.playerTwo.goUp = true;
            game.playerTwo.goDown = false;
          }

          if(game.twoVStwo){
            if(game.playerThree.amI){
              game.playerThree.goUp = true;
              game.playerThree.goDown = false;
            }else if(game.playerFour.amI){
              game.playerFour.goUp = true;
              game.playerFour.goDown = false;
            }
          }

        }
        
        if ( event.keyCode == game.keycode.SPACEBAR && !game.ball.inGame && game.gameOn) {
            if(game.playerOne.amI && game.playerOne.engaging){
              game.ball.inGame = true;
              game.ball.posX = game.playerOne.posX + game.playerOne.width;
              game.ball.posY = game.playerOne.posY;
              game.ball.directionX = 1;
              game.ball.directionY = 1;
              game.playerOne.engaging = false;
            }else if(game.playerTwo.amI && game.playerTwo.engaging){
              game.ball.inGame = true;
              game.ball.posX = game.playerTwo.posX - game.playerTwo.width;
              game.ball.posY = game.playerTwo.posY;
              game.ball.directionX = -1;
              game.ball.directionY = 1;
              game.playerTwo.engaging = false;
            }

            if(game.twoVStwo){
              if(game.playerThree.amI && game.playerThree.engaging){
                game.ball.inGame = true;
                game.ball.posX = game.playerThree.posX + game.playerThree.width;
                game.ball.posY = game.playerThree.posY;
                game.ball.directionX = 1;
                game.ball.directionY = 1;
                game.playerThree.engaging = false;
              }else if(game.playerFour.amI && game.playerFour.engaging){
                game.ball.inGame = true;
                game.ball.posX = game.playerFour.posX - game.playerFour.width;
                game.ball.posY = game.playerFour.posY;
                game.ball.directionX = -1;
                game.ball.directionY = 1;
                game.playerFour.engaging = false;
              }
            }
            
          }
      
    },
 
  onKeyUp : function(event) {

    if ( event.keyCode == game.keycode.KEYDOWN ) {
      if(game.playerOne.amI)
        game.playerOne.goDown = false;
      else if(game.playerTwo.amI)
        game.playerTwo.goDown = false;

      if(game.twoVStwo){
        if(game.playerThree.amI)
          game.playerThree.goDown = false;
        else if(game.playerFour.amI)
          game.playerFour.goDown = false;
      }

    } else if ( event.keyCode == game.keycode.KEYUP ) {
      if(game.playerOne.amI)
        game.playerOne.goUp = false;
      else if(game.playerTwo.amI)
        game.playerTwo.goUp = false;

      if(game.twoVStwo){
        if(game.playerThree.amI)
          game.playerThree.goUp = false;
        else if(game.playerFour.amI)
          game.playerFour.goUp = false;
      }
    }
  },

  onMouseMove : function(event) {
  
      game.control.controlSystem = "MOUSE";
   
      if ( event ) {
        game.control.mousePointer = event.clientY;
      }
    
      
        if ( game.control.mousePointer > game.playerOne.posY && game.gameOn) {
          if(game.playerOne.amI){
            game.playerOne.goDown = true;
            game.playerOne.goUp = false;
          }else if(game.playerTwo.amI){
            game.playerTwo.goDown = true;
            game.playerTwo.goUp = false;
          }
        } else if ( game.control.mousePointer < game.playerOne.posY && game.gameOn) {
          if(game.playerOne.amI){
            game.playerOne.goDown = false;
            game.playerOne.goUp = true;
          }else if(game.playerTwo.amI){
            game.playerTwo.goDown = false;
            game.playerTwo.goUp = true;
          }
        } else {
          if(game.playerOne.amI){
            game.playerOne.goDown = false;
            game.playerOne.goUp = false;
          }else if(game.playerTwo.amI){
            game.playerTwo.goDown = false;
            game.playerTwo.goUp = false;
          }
          
        }

    if(game.twoVStwo){
      if ( game.control.mousePointer > game.playerThree.posY && game.gameOn) {
        if(game.playerThree.amI){
          game.playerThree.goDown = true;
          game.playerThree.goUp = false;
        }else if(game.playerFour.amI){
          game.playerFour.goDown = true;
          game.playerFour.goUp = false;
        }
      } else if ( game.control.mousePointer < game.playerFour.posY && game.gameOn) {
        if(game.playerThree.amI){
          game.playerThree.goDown = false;
          game.playerThree.goUp = true;
        }else if(game.playerFour.amI){
          game.playerFour.goDown = false;
          game.playerFour.goUp = true;
        }
      } else {
        if(game.playerThree.amI){
          game.playerThree.goDown = false;
          game.playerThree.goUp = false;
        }else if(game.playerFour.amI){
          game.playerFour.goDown = false;
          game.playerFour.goUp = false;
        }
        
      }
    }
    },

    onStartGameClickButton : function() {
      if(!game.iaGame){
        if(!game.twoVStwo){
          if(game.playerOne.amI && !game.gameOn)game.beginingP1=true;
          else if (game.playerTwo.amI && !game.gameOn)game.beginingP2=true;
          if(!(game.beginingP1 && game.beginingP2) && !game.gameOn){
            document.getElementById('messageWaiting').textContent='Waiting for the second player ...';
            document.getElementById('messageWaiting').style.display='block';
          }
      }else{
        if(game.playerOne.amI && !game.gameOn)game.beginingP1=true;
        else if (game.playerTwo.amI && !game.gameOn)game.beginingP2=true;
        else if (game.playerThree.amI && !game.gameOn)game.beginingP3=true;
        else if (game.playerFour.amI && !game.gameOn)game.beginingP4=true;
        if(!(game.beginingP1 && game.beginingP2 && game.beginingP3 && game.beginingP4) && !game.gameOn){
          document.getElementById('messageWaiting').textContent='Waiting other players ...';
          document.getElementById('messageWaiting').style.display='block';
        }
      }

    }else{
      game.beginingP1=true
      game.beginingP2=true;
      game.playerTwo.ready=true;
      game.playerOne.ready=true;
      game.gameOn=true;
      document.getElementById('startGame').disabled=true;
      document.getElementById('messageWaiting').textContent='';
      document.getElementById('messageWaiting').style.display='none';
      if(game.iaGameFinish){
        game.reinitGame();
        game.iaGameFinish=false;
      }
    }
    }
}