/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="badguy.ts" />
/// <reference path="portal.ts" />

interface PortalSpawn {
   location: ex.Point;
   type: Shape;
   rate: number;
   rateTimer: number;
   baddies: Badguy[];
   maxSimultaneous: number;
   closeAmount: number;
}
interface Wave {
   portals: PortalSpawn[];
}

class BadGuyFactory implements Pausable {
   
   private _waveStarted = false;
   private _waveInfo: Wave;   
   private _portalSpawnWaitTimer = 0;
   private _openPortals: Portal[] = [];
   
   public paused: boolean = false;
   
   constructor() {
      
   }
   
   update(engine: ex.Engine, delta: number) {
      if (this._waveStarted) {
         this._portalSpawnWaitTimer = Config.PortalSpawnWaitTime;
         this._waveStarted = false;
      }
      
      // check if portals can be closed
      var portalsToClose: Portal[] = [];
      for (let p of this._openPortals) {
         var poolAmount = 0;
         switch(p.state.type) {
            case Shape.Shape1:
               poolAmount = GameState.state.ship.state.squarePool;
               break;
            case Shape.Shape2:
               poolAmount = GameState.state.ship.state.circlePool;
               break;
            case Shape.Shape3:
               poolAmount = GameState.state.ship.state.trianglePool;
               break;
         }
         if (poolAmount >= p.state.closeAmount) {
            // close portal
            //poolAmount = 0;
            portalsToClose.push(p);
         }
      }
      
      if (portalsToClose.length > 0) {
            this.closePortals(portalsToClose);
      }
      
      for (let p of portalsToClose) {
      //    this.closePortal(p);
         switch(p.state.type) {
            case Shape.Shape1:
               GameState.state.ship.state.squarePool = 0;
               break;
            case Shape.Shape2:
               GameState.state.ship.state.circlePool = 0;
               break;
            case Shape.Shape3:
               GameState.state.ship.state.trianglePool = 0;
               break;
         }
      }
      
      if (this._openPortals.length === 0) {
         this.nextWave();
         return;
      }
      
      // after portal spawns, spawn enemies
      if (!this.paused) {
            if (this._portalSpawnWaitTimer <= 0) {
            
            // for open portals, spawn baddies
            for (let p of this._openPortals) {
                  
                  // remove killed baddies
                  let baddiesToRemove: Badguy[] = [];
                  for (let b of p.state.baddies) {
                  if (b.isKilled()) {
                        baddiesToRemove.push(b);
                  }
                  }
                  for (let b of baddiesToRemove) {
                  p.state.baddies.splice(p.state.baddies.indexOf(b), 1);
                  }
                  
                  if (p.state.rateTimer <= 0 && p.state.baddies.length < p.state.maxSimultaneous) {
                  
                  this.spawnBaddie(p.state);
                  p.state.rateTimer = p.state.rate;
                  } else {
                  p.state.rateTimer -= delta;
                  }
            }
            
            } else {
            this._portalSpawnWaitTimer -= delta;
            }
      }                
   }
   
   spawnBaddie(portal: PortalSpawn) {
      var baddie = new Badguy(portal.location.x, portal.location.y, portal.type);
      // baddie.on('kill', () => {
      //    var idx = portal.baddies.indexOf(baddie);
      //    portal.baddies.splice(idx, 1);         
      // });
      game.add(baddie);
      portal.baddies.push(baddie);
   }     
   
   nextWave() {
      this._waveStarted = true;
      
      if (this._waveInfo) {
         for (let p of this._waveInfo.portals) {
            for (let b of p.baddies) {
               game.remove(b);               
            }
            p.baddies.length = 0;
         }
      }
      // despawn portals
      for(let p of this._openPortals) {
         game.remove(p);         
      }
      this._openPortals.length = 0;
      var stage = GameState.state.stage += 1;
      
      // set spawn locations
      if (stage === 1) {
         // place portal in center
         this._waveInfo = {
            portals: [{
               location: new ex.Point(2500, 420),
               rate: 2000,
               rateTimer: 0,
               baddies: [],
               maxSimultaneous: 3,
               type: Shape.Shape1,
               closeAmount: 5
            }]
         };
         this.spawnPortals();
      } else if (stage === 2) {
            this._waveInfo = {
            portals: [{
               location: new ex.Point(2500, 420),
               rate: 2000,
               rateTimer: 0,
               baddies: [],
               maxSimultaneous: 3,
               type: Shape.Shape1,
               closeAmount: 5
            }, 
            {
               location: new ex.Point(3000, 420),
               rate: 2000,
               rateTimer: 0,
               baddies: [],
               maxSimultaneous: 3,
               type: Shape.Shape2,
               closeAmount: 5
            }]
         };
         this.spawnPortals();
      } else {
         // win!
         endscreen.win();
      }
   }
   
   spawnPortals() {
      this.paused = true;
      var o = new ex.Actor(GameState.state.ship.x, GameState.state.ship.y, 1, 1, ex.Color.Transparent);
      game.add(o);
      cameraDestActor = o;
      
      o.delay(100).callMethod(() => { pause(); }); // calling pause by itself interrupts the updates before the witch sprite loads
      
      for(let portal of this._waveInfo.portals) {
            // console.log('adding portal')
         
         let p = new Portal(portal);
         game.add(p);
         this._openPortals.push(p);
         
         o.easeTo(p.x, p.y, 400, ex.EasingFunctions.EaseInCubic).callMethod(() => {console.log('spawn portal')}).delay(2000);
      //    console.log(o.actionQueue);
      }
      
      o.easeTo(GameState.state.ship.x, GameState.state.ship.y, 400, ex.EasingFunctions.EaseOutCubic).callMethod(() => { 
            cameraDestActor = GameState.state.ship;
            resume();
            this.paused = false;
      }).die();
   }

//    spawnPortals() {
//       for(let portal of this._waveInfo.portals) {
//          let p = new Portal(portal);
//          game.add(p);
//          this._openPortals.push(p);
//       }
//    }
   
//    closePortal(p: Portal) {
//       var idx = this._openPortals.indexOf(p);
//       this._openPortals.splice(idx, 1);
      
//       pause();
      
//       var o = new ex.Actor(GameState.state.ship.x, GameState.state.ship.y, 1, 1, ex.Color.Transparent);
//       game.add(o);
      
//       cameraDestActor = o;
      
//       // move to portal
//       o.easeTo(p.x, p.y, 400, ex.EasingFunctions.EaseInCubic).callMethod(() => {
//             //p.setDrawing('death');
//             p.delay(2000).callMethod(() => {
//                   // move to player
//                   o.easeTo(GameState.state.ship.x, GameState.state.ship.y, 400, ex.EasingFunctions.EaseOutCubic).callMethod(() => {
//                         cameraDestActor = GameState.state.ship;
//                         resume();                        
//                   });//.die();
                  
//             }).die();
//       });
//    }
   
   closePortals(portals: Portal[]) {
      // this.paused = true;
      var orc = new ex.Actor(GameState.state.ship.x, GameState.state.ship.y, 1, 1, ex.Color.Transparent);
      game.add(orc);
      cameraDestActor = orc;
      pause();
      for (let p of portals) {
            // console.log('closing portal')
            let idx = this._openPortals.indexOf(p);
            this._openPortals.splice(idx, 1);
            
            orc.easeTo(p.x, p.y, 400, ex.EasingFunctions.EaseInCubic).callMethod(() => {console.log('close portal')}).delay(2000);
      }
      orc.easeTo(GameState.state.ship.x, GameState.state.ship.y, 400, ex.EasingFunctions.EaseOutCubic).callMethod(() => { 
            cameraDestActor = GameState.state.ship;
            resume();
            // this.paused = false;
      }).die();
   }
   
   getWave(): Wave {
      return this._waveInfo;
   }
}