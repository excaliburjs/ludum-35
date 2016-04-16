/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="shape.ts" />
/// <reference path="weapon.ts" />
/// <reference path="resources.ts" />
/// <reference path="config.ts" />
interface ShipState {
   shieldType: Shape;
   weapon: Weapon;
}

class Ship extends ex.Actor implements Stateful<ShipState> {
   private _circle: ex.Animation;
   private _triangle: ex.Animation;
   private _square: ex.Animation;
   
   public state: ShipState;
   
   constructor(x, y, width, height){
      super(x, y, width, height);
      
      this.color = ex.Color.Red.clone();           
      this.scale.setTo(2,2);
      this.anchor.setTo(.5, .5);
      this.setCenterDrawing(true);
      this.reset();
   }
   
   onInitialize(engine: ex.Engine) {
      var shipSheet = new ex.SpriteSheet(Resources.ShipSpriteSheet, 3, 1, 32, 42);
      var squareSheild = new ex.SpriteSheet(Resources.SquareShieldSheet, 5, 1, 48, 48);      
      var circleSheild = new ex.SpriteSheet(Resources.CircleShieldSheet, 5, 1, 48, 48);
      var triangleSheild = new ex.SpriteSheet(Resources.TriangleShieldSheet, 5, 1, 48, 48);
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
      
      ship.on('preupdate', this.preupdate);            
      ship.on('predraw', this.predraw);
   }
   
   reset(state?: ShipState) {
      if (!state) {
         this.state = {
            shieldType: Shape.Shape1,
            weapon: new StraightShooter(this, Config.bullets.speed, Config.bullets.damage)
         }
      } else {
         this.state = state;
      }
      return this;
   }
   
   preupdate(evt: ex.PreUpdateEvent) {
      //console.log(`Update: ${evt.delta}`);
      evt.engine.input.pointers.primary.on('down', (click: ex.Input.PointerEvent) => {
         var dx = click.x - GameState.state.ship.x;
         var dy = click.y - GameState.state.ship.y;
         
         GameState.state.ship.dx = dx * Config.shipSpeedScale;
         GameState.state.ship.dy = dy * Config.shipSpeedScale;
         
         GameState.state.ship.rotation = (new ex.Vector(dx, dy)).toAngle();
      });
      
      var oppVel = new ex.Vector(this.dx, this.dy).scale(-1).scale(Config.spaceFriction);
      this.dx += oppVel.x;
      this.dy += oppVel.y;
      
      this.state.weapon.update(evt.delta);
   }
   
   predraw(evt: ex.PreDrawEvent) {
      if(this.state.shieldType === Shape.Shape1){
         this._square.draw(evt.ctx, 0, 0);
      }            
      if(this.state.shieldType === Shape.Shape2){
         this._circle.draw(evt.ctx, 0, 0);
      }
      if(this.state.shieldType === Shape.Shape3){
         this._triangle.draw(evt.ctx, 0, 0);
      }
   }   
}