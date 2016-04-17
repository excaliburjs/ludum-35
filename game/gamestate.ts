/// <reference path="./ship.ts" />
/// <reference path="bullet.ts" />
/// <reference path="pool.ts" />
/// <reference path="stats.ts" />


interface IGameState {
   ship: Ship;
   bullets: Pool<Bullet, BulletState>;
   stats: Stat[]
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
      static init(game: ex.Engine) {
                      
         GameState.state = {
            ship: new Ship(100, 100, 48, 48),
            bullets: new Pool<Bullet, BulletState>(500, () => {
                  var b = new Bullet();
                  game.add(b);
                  return b;
            }),
            stats: [new Stat("KILLS", 0)]
         };
         GameState.state.bullets.fill();
         
         game.add(GameState.state.ship);
      }
   
}