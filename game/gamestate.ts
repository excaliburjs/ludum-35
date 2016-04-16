/// <reference path="./ship.ts" />
/// <reference path="bullet.ts" />
/// <reference path="pool.ts" />

interface IGameState {
   ship: Ship;
   bullets: Pool<Bullet, BulletState>;
}

// one global area to track game state, makes the game easier to restart
class GameState {
      static state: IGameState = {
         ship: null,
         bullets: new Pool<Bullet, BulletState>(500, () => new Bullet())
      }
      
      // set any defaults
      init(state: IGameState){
         GameState.state = state;
      }
   
}