
/// <reference path="./ship.ts" />
interface IGameState {
   ship: Ship;
}

// one global area to track game state, makes the game easier to restart
class GameState {
      static state: IGameState = {
         ship: null
      }
      
      // set any defaults
      init(state: IGameState){
         GameState.state = state;
      }
   
}