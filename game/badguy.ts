/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />


interface BadguyState {
   x: number;
   y: number;
   d: ex.Vector;
   speed: number;
   size: number;
   shape: Shape;
   weapon: Weapon;
}

class Badguy extends ex.Actor implements Stateful<BadguyState> {
   id: number;
   
   //todo remove when pooling is implemented
   public weapon: Weapon; 
   constructor(x, y, width, height, badguytype) {
      super(x, y, width, height);
      this.collisionType = ex.CollisionType.Active;
      var BadguyTypes = [
           Resources.TriangleBadguySheet
         , Resources.SquareBadguySheet
         , Resources.CircleBadguySheet
         ];
         
      this.ActiveType = BadguyTypes[badguytype];
      
      var BadGuySheet = new ex.SpriteSheet(ActiveType, 2, 1, 32, 32);
      
      this.scale.setTo(2,2);
      //this.anchor.setTo(.1, .1);
      
      this.setCenterDrawing(true);
      this.onInitialize = (engine: ex.Engine) => {
         var badguy = this;
         var anim = BadGuySheet.getAnimationForAll(engine, 150);
         //var anim = BadGuySheet.getAnimationBetween(engine, 1, 2, 150);
         
         
         anim.loop = true;
         anim.anchor.setTo(.3, .3);
         this.addDrawing('default', anim);
         
         //initialize badguy
         badguy.on('preupdate', this.preupdate);
         badguy.on('collision', this._collision);
      }
      this.weapon = new StraightShooter(this, Config.bullets.speed, Config.bullets.damage)
   }
   preupdate(evt: ex.PreUpdateEvent){
      
      
      var dx = GameState.state.ship.x;
      var dy = GameState.state.ship.y;
      var oppVel = new ex.Vector(this.dx, this.dy).scale(-1).scale(Config.spaceFriction);
      
      this.dx += oppVel.x;
      this.dy += oppVel.y;
   
    }
    
    _collision(collision: ex.CollisionEvent){
      //var BadGuySheet = new ex.SpriteSheet(this.ActiveType, 5, 1, 32, 32);
      
      //var anim = BadGuySheet.getAnimationForAll(ex.Engine, 150);
      
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
            shape: Shape.Shape1,
            weapon: new StraightShooter(this, Config.bullets.speed, Config.bullets.damage)
         }
      } else {
         this.state = state;
      }
      
      return this;
   }
}