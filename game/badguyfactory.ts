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
      
      // after portal spawns, spawn enemies
      if (this._portalSpawnWaitTimer <= 0) {
         for (let p of this._waveInfo.portals) {
            
            // remove killed baddies
            let baddiesToRemove: Badguy[] = [];
            for (let b of p.baddies) {
               if (b.isKilled()) {
                  baddiesToRemove.push(b);
               }
            }
            for (let b of baddiesToRemove) {
               p.baddies.splice(p.baddies.indexOf(b), 1);
            }
            
            if (p.rateTimer <= 0 && p.baddies.length < p.maxSimultaneous) {
               
               this.spawnBaddie(p);
               p.rateTimer = p.rate;
            } else {
               p.rateTimer -= delta;
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
               type: Shape.Shape1
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
}