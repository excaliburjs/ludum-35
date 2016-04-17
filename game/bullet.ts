/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />

interface BulletState {
   owner: ex.Actor;
   x: number;
   y: number;
   d: ex.Vector;
   speed: number;
   damage: number;
   shape?: Shape;
}

class Bullet extends ex.Actor implements Stateful<BulletState>, Poolable {
   
   poolId: number;
  
   public owner: ex.Actor = null;
   constructor() {
      super(0, 0, 3, 3, ex.Color.Red);
      this.collisionType = ex.CollisionType.Passive;
      this.reset();
      this.on('exitviewport', () => GameState.state.bullets.despawn(this));
      this.on('collision', this._collision);
   }
   
   state: BulletState;
   _collision(collision: ex.CollisionEvent) {
      if(this.visible){
         console.log(this.owner);
         Resources.Explode.play();
         collision.other.kill();
      }
   }
   reset(state?: BulletState) {
      
      if (!state) {
         
         this.visible = false;
         // defaults
         this.state = {
            owner: null,
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
         this.owner = state.owner;
         var normalized = this.state.d.normalize();
         this.dx = normalized.x * this.state.speed;
         this.dy = normalized.y * this.state.speed;
      }
      
      return this;
   }
}