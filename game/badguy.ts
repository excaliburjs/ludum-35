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
      
      var BadguyTypes = [
           Resources.TriangleBadguySheet
         , Resources.SquareBadguySheet
         , Resources.CircleBadguySheet
         ];
         
      var ActiveType = BadguyTypes[badguytype];
      
      var BadGuySheet = new ex.SpriteSheet(ActiveType, 2, 1, 32, 32);
      //var CircleBadguySheet = new ex.SpriteSheet(Resources.CircleBadguySheet, 5, 1, 48, 48);
      //var SquareBadguySheet = new ex.SpriteSheet(Resources.SquareBadguySheet, 5, 1, 48, 48);
      //var TriangleBadguySheet = new ex.SpriteSheet(Resources.TriangleBadguySheet, 5, 1, 48, 48);

      this.scale.setTo(2,2);
      this.anchor.setTo(.1, .1);
      this.setCenterDrawing(true);
      this.onInitialize = (engine: ex.Engine) => {
         var badguy = this;
         var anim = BadGuySheet.getAnimationForAll(engine, 150);
         
         anim.loop = true;
         anim.anchor.setTo(.3, .3);
         this.addDrawing('default', anim);
         
         //initialize badguy
         badguy.on('preupdate', (evt: ex.PreUpdateEvent) => {
            badguy.dx = Config.badguy.speed;
            badguy.dy = Config.badguy.speed;
            
         });
      }
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