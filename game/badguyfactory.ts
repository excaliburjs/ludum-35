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

class BadGuyFactory {
   
   private _waveStarted = false;
   private _waveInfo: Wave;   
   private _portalSpawnWaitTimer = 0;
   private _openPortals: Portal[] = [];
   
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
               poolAmount = GameState.state.ship.state.trianglePool;
               break;
            case Shape.Shape2:
               poolAmount = GameState.state.ship.state.circlePool;
               break;
            case Shape.Shape3:
               poolAmount = GameState.state.ship.state.squarePool;
               break;
         }
         if (poolAmount >= p.state.closeAmount) {
            // close portal
            //poolAmount = 0;
            portalsToClose.push(p);
         }
      }
      
      for (let p of portalsToClose) {
         this.closePortal(p); 
      }
      
      if (this._openPortals.length === 0) {
         this.nextWave();
         return;
      }
      
      // after portal spawns, spawn enemies
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
      } else {
         // win!
      }
   }
   
   spawnPortals() {
      for(let portal of this._waveInfo.portals) {
         let p = new Portal(portal);
         game.add(p);
         this._openPortals.push(p);
      }
   }
   
   closePortal(p: Portal) {
      var idx = this._openPortals.indexOf(p);
      this._openPortals.splice(idx, 1);
      game.remove(p);
   }
}