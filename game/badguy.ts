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
  
  private BadGuySheet: ex.SpriteSheet;
   
   constructor(x, y, private badguytype: Shape) {
      super(x, y, 32, 32);
      
      this.collisionType = ex.CollisionType.Passive;
      
      this.scale.setTo(2,2);
      //this.anchor.setTo(.1, .1);
      
      this.setCenterDrawing(true);
      this.onInitialize = (engine: ex.Engine) => {
         var badguy = this;
         this.setZIndex(2);
         if(this.badguytype == Shape.Shape1){
           this.addDrawing('default', GlobalAnimations.SquareBaddie);
         }else if (this.badguytype == Shape.Shape2){
           this.addDrawing('default', GlobalAnimations.CircleBaddie);
         }else if (this.badguytype === Shape.Shape3){
           this.addDrawing('default', GlobalAnimations.TriangleBaddie);
         }
         
         //initialize badguy
         badguy.on('preupdate', this._preupdate);
         badguy.on('update', this._update);
         badguy.on('collision', this._collision);
      }
      this.reset();
   }
   _preupdate(evt: ex.PreUpdateEvent){
      
      /*
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
      
      
      */
      this.state.weapon.update(evt.delta);
    }
    _update(evt: ex.UpdateEvent){
      var hitborder = false;
      
       if (this.x > gameBounds.right) {
           this.x = gameBounds.right;
           this.dx *= -1;
           //this.dy *= -1;
           hitborder = true;
       }
       if (this.x < gameBounds.left) {
           this.x = gameBounds.left;
           this.dx *= -1;
           //this.dy *= -1; 
           hitborder = true;
      }
       if (this.y > gameBounds.bottom) {
           this.y = gameBounds.bottom;
           this.dy *= -1;
           //this.dx *= -1;
           hitborder = true;
       }
       if (this.y < gameBounds.top) {
           this.y = gameBounds.top;
           this.dy *= -1;
           //this.dx *= -1;
           hitborder = true;
       }
       
      var player = GameState.state.ship;
      var target = new ex.Vector(player.x, player.y);
      var randomAngle = ex.Util.randomInRange(0, Math.PI*2);
      var missFactor = new ex.Vector(Config.badguy.missRadius * Math.cos(randomAngle), Config.badguy.missRadius * Math.sin(randomAngle));
      target = target.add(missFactor);
      
      var direction = target.minus(new ex.Vector(this.x, this.y));
      
      var steering = direction.normalize().scale(5);
      var currentSpeed = new ex.Vector(this.dx, this.dy);
      var newVel = steering.add(currentSpeed).normalize().scale(Config.badguy.speed);
      this.dx = newVel.x;
      this.dy = newVel.y;
    }
    _collision(collision: ex.CollisionEvent){
      //explode?
      
    }
       
   reset(state?: BadguyState) {
      if (!state) {
         
         this.state = {
            x: 0,
            y: 0,
            d: new ex.Vector(0, 0),
            speed: Config.badguy.speed,
            size: Config.badguy.size,
            shape: this.badguytype,
            weapon: new ShapeShooter(this, Config.bullets.speed, Config.bullets.damage, this.badguytype)
         }
      } else {
         this.state = state;
      }
      
      return this;
   }
}