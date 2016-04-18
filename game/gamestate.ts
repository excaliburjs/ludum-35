/// <reference path="./ship.ts" />
/// <reference path="bullet.ts" />
/// <reference path="pool.ts" />
/// <reference path="stats.ts" />


interface IGameState {
   ship: Ship;
   bullets: Pool<Bullet, BulletState>;
   stats: Stat[],
   stage: number
}

// one global area to track game state, makes the game easier to restart
class GameState {
      static state: IGameState;
      
      static getStatIdx(name : string) : number {
           var idx = -1;
           GameState.state.stats.filter(function(itm,currIdx){
              if (itm.getStatName() === name){
                    idx = currIdx;
              }
              return itm.getStatName() === name    
           });
           return idx;
      }
      
      static getGameStat(name: string){
            var statIdx = this.getStatIdx(name);
            if(statIdx != -1){
               return GameState.state.stats[statIdx].state.value;  
            }else{
                 console.error(name + " isn't the name of any game stat."); 
            }

      }
      
      static setGameStat(name: string, value: string|number){
            var statIdx = this.getStatIdx(name);
            if(statIdx != -1){
               GameState.state.stats[statIdx].state.value = value;  
            }else{
                 console.error(name + " isn't the name of any game stat."); 
            }

      }
      
      // set any defaults
      static init() {
            
         // reset current engine state
         if (GameState.state) {
            game.remove(GameState.state.ship);
         }
         
         GameState.state = {
            ship: new Ship(Config.PlayerSpawn.x, Config.PlayerSpawn.y, 48, 48),
            bullets: null,
            stats: [new Stat("KILLS", 0)],
            stage: 0
         };
         //GameState.state.bullets.fill();
         
         game.add(GameState.state.ship);
         
         // start the waves
         badGuyFactory.nextWave();
      }
      
      static reset() {
            this._resetPlayer();
            this._resetStats();
            this.state.stage = 0;
            badGuyFactory.nextWave();
      }
      
      private static _resetPlayer() {
            GameState.state.ship.dx = 0;
            GameState.state.ship.dy = 0;
            GameState.state.ship.x = Config.PlayerSpawn.x;
            GameState.state.ship.y = Config.PlayerSpawn.y;
            GameState.state.ship.rotation = 0;
            // GameState.state.ship.reset();
            //TODO calling reset() breaks player input, something related to creating a new Weapon
            GameState.state.ship.state.shieldType = Shape.Shape1;
            GameState.state.ship.state.squarePool = 0;
            GameState.state.ship.state.circlePool = 0;
            GameState.state.ship.state.trianglePool = 0;
            GameState.state.ship.state.health = Config.playerHealth;
            
            game.add(GameState.state.ship);
      }
      
      private static _resetStats() {
            this.setGameStat('KILLS', 0);
      }
   
}