
// one global area to track game state, makes the game easier to restart
class GameState {
      static state: any = {
         
      }
      
      // set any defaults
      init(){
         GameState.state = {};
      }
   
}