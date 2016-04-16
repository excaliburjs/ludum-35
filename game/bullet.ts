/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />

interface BulletState {
   x: number;
   y: number;
   d: ex.Vector;
   speed: number;
   damage: number;
   shape: Shape;
}

class Bullet extends ex.Actor implements Stateful<BulletState> {
   
   id: number;
   
   constructor() {
      super(0, 0, 1, 1);
   }
   
   state: BulletState;
   
   reset(state?: BulletState) {
      
      if (!state) {
         
         // defaults
         this.state = {
            x: 0,
            y: 0,
            d: new ex.Vector(0, 0),
            damage: Config.bullets.damage,
            speed: Config.bullets.speed,
            shape: Shape.Shape1
         }         
      } else {
         this.state = state;
      }
      
      return this;
   }
   
}