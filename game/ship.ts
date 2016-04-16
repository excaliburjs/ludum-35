/// <reference path="../Excalibur/dist/Excalibur.d.ts" />

class Ship extends ex.Actor {
   public sheildType: "circle" | "square" | "triangle" = "square";
   private _circle: ex.Animation;
   private _triangle: ex.Animation;
   private _square: ex.Animation;
   constructor(x, y, width, height){
      super(x, y, width, height);
      this.color = ex.Color.Red.clone();
      var shipSheet = new ex.SpriteSheet(Resources.ShipSpriteSheet, 3, 1, 32, 42);
      var squareSheild = new ex.SpriteSheet(Resources.SquareSheildSheet, 5, 1, 48, 48);      
      var circleSheild = new ex.SpriteSheet(Resources.CircleSheildSheet, 5, 1, 48, 48);
      var triangleSheild = new ex.SpriteSheet(Resources.TriangleSheildSheet, 5, 1, 48, 48);
      
      this.scale.setTo(2,2);
      this.anchor.setTo(.5, .5);
      this.setCenterDrawing(true);
      this.onInitialize = (engine: ex.Engine) => {
         var ship = this;
         var anim = shipSheet.getAnimationForAll(engine, 150);
         anim.rotation = Math.PI/2;
         anim.loop = true;
         anim.anchor.setTo(.5, .5);
         this.addDrawing('default', anim);
         
         this._circle = circleSheild.getAnimationForAll(engine, 50);
         this._circle.loop = true;
         this._circle.anchor.setTo(.5, .5);
         this._square = squareSheild.getAnimationForAll(engine, 50);
         this._square.loop = true;
         this._square.anchor.setTo(.5, .5);
         this._triangle = triangleSheild.getAnimationForAll(engine, 50);
         this._triangle.loop = true;
         this._triangle.anchor.setTo(.5, .5);
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
         
         
         ship.on('predraw', (evt: ex.PostDrawEvent) => {
            if(this.sheildType === "circle"){
               this._circle.draw(evt.ctx, 0, 0);
            }
            
            if(this.sheildType === "square"){
               this._square.draw(evt.ctx, 0, 0);
            }
            if(this.sheildType === "triangle"){
               this._triangle.draw(evt.ctx, 0, 0);
            }
         });
   
      }
   }
   
   
   
   
   
}