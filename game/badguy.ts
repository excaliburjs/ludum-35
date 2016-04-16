/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />


interface BadguyState {
   x: number;
   y: number;
   d: ex.Vector;
   speed: number;
   size: number;
   shape: Shape;
   
}

class Badguy extends ex.Actor implements Stateful<BadguyState> {
   id: number;
   
   constructor() {
      super(0, 0, 1, 1);
   }

   state: BadguyState;
   
   reset(state?: BadguyState) {
      if (!state) {
         
         this.state = {
            x: 0,
            y: 0,
            d: new ex.Vector(0, 0),
            speed: Config.badguy.speed,
            size: Config.badguy.size,
            shape: Shape.Shape1
         }
         
      } else {
         this.state = state;
      }
      
      return this;
   }

}