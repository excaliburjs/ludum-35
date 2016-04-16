/// <reference path="./ship.ts" />
/// <reference path="bullet.ts" />
/// <reference path="pool.ts" />

interface IGameState {
   ship: Ship;
   bullets: Pool<Bullet, BulletState>;
}

// one global area to track game state, makes the game easier to restart
class GameState {
      static state: IGameState;
      
      // set any defaults
      static init(game: ex.Engine) {
         GameState.state = {
            ship: new Ship(100, 100, 100, 100),
            bullets: new Pool<Bullet, BulletState>(500, () => {
                  var b = new Bullet();
                  game.add(b);
                  return b;
            })
         };
         GameState.state.bullets.fill();
         
         game.add(GameState.state.ship);
      }
   
}