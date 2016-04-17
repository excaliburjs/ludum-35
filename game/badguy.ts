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
   
   constructor(x, y, width, height, badguytype) {
      super(x, y, width, height);
      this.collisionType = ex.CollisionType.Active;
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
         //var anim = BadGuySheet.getAnimationBetween(engine, 0, 5, 150);
         
         
         anim.loop = true;
         anim.anchor.setTo(.3, .3);
         this.addDrawing('default', anim);
         
         //initialize badguy
         badguy.on('preupdate', this.preupdate);
      }
   }
    preupdate(evt: ex.PreUpdateEvent){
      
      var multiplier = Math.random();
      
      if (multiplier !== 1){
        multiplier = -1;
      }
      
      
      var dy = this.y * multiplier;
      var dx = this.x * multiplier;
      this.dx = dy;
      this.dy = dx;
      
      
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