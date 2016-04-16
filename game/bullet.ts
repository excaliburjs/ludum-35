/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />

interface BulletState {
   x: number;
   y: number;
   d: ex.Vector;
   speed: number;
   damage: number;
   shape?: Shape;
}

class Bullet extends ex.Actor implements Stateful<BulletState> {
   
   id: number;
   
   constructor() {
      super(0, 0, 3, 3, ex.Color.Red);
      
      this.reset();
      this.on('exitviewport', () => this.reset());
   }
   
   state: BulletState;
   
   reset(state?: BulletState) {
      
      if (!state) {
         
         this.visible = false;
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
         this.visible = true;
         this.state = state;
         this.x = state.x;
         this.y = state.y;
         var normalized = this.state.d.normalize();
         this.dx = normalized.x * this.state.speed;
         this.dy = normalized.y * this.state.speed;
      }
      
      return this;
   }
}