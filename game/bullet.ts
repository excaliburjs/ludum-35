/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />
/// <reference path="gamestate.ts" />


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
   private _triangleBulletAnim;
   private _circleBulletAnim;
   private _squareBulletAnim;
   constructor() {
      super(0, 0, 3, 3, ex.Color.Red);
      this.collisionType = ex.CollisionType.Passive;
      this.reset();
      this.rx = Config.bullets.rotation;
      this.scale.setTo(.5, .5);
      this.on('exitviewport', () => GameState.state.bullets.despawn(this));
      this.on('collision', this._collision);
      this.on('postdraw', this.postdraw);
   }
   
   state: BulletState;
   _collision(collision: ex.CollisionEvent) {
      if(this.visible){
         if(this.owner.constructor !== collision.other.constructor) {
            Resources.Explode.play();
            collision.other.kill();
            var currKills = parseInt(GameState.getGameStat("KILLS").toString()) + 1;
            GameState.setGameStat("KILLS", currKills);
            GameState.state.bullets.despawn(this);
         }
      }
   }
   onInitialize(engine: ex.Engine){
      var triangleBulletSheet = new ex.SpriteSheet(Resources.TriangleBullet, 3, 1, 32, 32);      
      var circleBulletSheet = new ex.SpriteSheet(Resources.CircleBullet, 3, 1, 32, 32);
      var squareBulletSheet = new ex.SpriteSheet(Resources.SquareBullet, 3, 1, 32, 32);
      
      this._triangleBulletAnim = triangleBulletSheet.getAnimationForAll(engine, 100);
      this._triangleBulletAnim.anchor.setTo(.5, .5);
      this._triangleBulletAnim.loop = true;
      
      this._circleBulletAnim = circleBulletSheet.getAnimationForAll(engine, 100);
      this._circleBulletAnim.anchor.setTo(.5, .5);
      this._circleBulletAnim.loop = true;
      
      this._squareBulletAnim = squareBulletSheet.getAnimationForAll(engine, 100);
      this._squareBulletAnim.anchor.setTo(.5, .5);
      this._squareBulletAnim.loop = true;
      
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
   
   postdraw(evt: ex.PostDrawEvent){
      if(this.state.shape === Shape.Shape1){
         this._squareBulletAnim.draw(evt.ctx, 0, 0);
      }            
      if(this.state.shape === Shape.Shape2){
         this._circleBulletAnim.draw(evt.ctx, 0, 0);
      }
      if(this.state.shape === Shape.Shape3){
         this._triangleBulletAnim.draw(evt.ctx, 0, 0);
      }
   }
   
}