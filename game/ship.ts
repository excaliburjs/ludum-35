/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
class Ship extends ex.Actor {
   constructor(x, y, width, height){
      super(x, y, width, height);
      this.color = ex.Color.Red.clone();
      var shipSheet = new ex.SpriteSheet(Resources.ShipSpriteSheet, 3, 1, 32, 42);
      this.scale.setTo(2,2);
      this.anchor.setTo(.5, .5);
      this.setCenterDrawing(true);
      this.onInitialize = (engine: ex.Engine) => {
         var ship = this;
         var anim = shipSheet.getAnimationForAll(engine, 150);
         anim.rotation = Math.PI/2;
         anim.loop = true;
         anim.anchor.setTo(.5, .5)
         this.addDrawing('default', anim);
         //initialize ship 
         ship.on('preupdate', (evt: ex.PreUpdateEvent) => {
            //console.log(`Update: ${evt.delta}`);
            evt.engine.input.pointers.primary.on('down', (click: ex.Input.PointerEvent) => {
               var dx = click.x - ship.x;
               var dy = click.y - ship.y;
               
               ship.dx = dx * Config.shipSpeedScale;
               ship.dy = dy * Config.shipSpeedScale;
               
               ship.rotation = (new ex.Vector(dx, dy)).toAngle();
            });
         });
   
      }
   }
   
   
   
   
   
}