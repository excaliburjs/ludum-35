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
   //public weapon: Weapon; 
   public state: BadguyState;
   constructor(x, y, width, height, badguytype) {
      super(x, y, width, height);
      this.collisionType = ex.CollisionType.Passive;
      var BadguyTypes = [
           Resources.TriangleBadguySheet
         , Resources.SquareBadguySheet
         , Resources.CircleBadguySheet
         ];
         
      var ActiveType = BadguyTypes[badguytype];
      
      var BadGuySheet = new ex.SpriteSheet(ActiveType, 2, 1, 32, 32);
      
      this.scale.setTo(2,2);
      //this.anchor.setTo(.1, .1);
      
      this.setCenterDrawing(true);
      this.onInitialize = (engine: ex.Engine) => {
         var badguy = this;
         var anim = BadGuySheet.getAnimationForAll(engine, 150);
         
         anim.loop = true;
         anim.anchor.setTo(.3, .3);
         this.addDrawing('default', anim);
         
         //initialize badguy
         badguy.on('preupdate', this._preupdate);
         badguy.on('update', this._update);
         badguy.on('collision', this._collision);
      }
      this.reset(this.state);
   }
   _preupdate(evt: ex.PreUpdateEvent){
      
    
      if (this.dx >= 0){
        this.dx = Config.badguy.speed;
      } else {
        this.dx = Config.badguy.speed * -1;
      }
      
      if (this.dy >= 0) {
        this.dy = Config.badguy.speed;
      } else {
        this.dy = Config.badguy.speed * -1;
      }
    this.state.weapon.update(evt.delta);
    }
    _update(evt: ex.UpdateEvent){
       if (this.x > gameBounds.right) {
           this.x = gameBounds.right;
           this.dx *= -1;
           this.dy *= -1;
       }
       if (this.x < gameBounds.left) {
           this.x = gameBounds.left;
           this.dx *= -1;
           this.dy *= -1; 
      }
       if (this.y > gameBounds.bottom) {
           this.y = gameBounds.bottom;
           this.dy *= -1;
           this.dx *= -1;
       }
       if (this.y < gameBounds.top) {
           this.y = gameBounds.top;
           this.dy *= -1;
           this.dx *= -1;
       }
    }
    _collision(collision: ex.CollisionEvent){
      //var BadGuySheet = new ex.SpriteSheet(this.ActiveType, 5, 1, 32, 32);
      
      //var anim = BadGuySheet.getAnimationForAll(ex.Engine, 150);
      
    }
       
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