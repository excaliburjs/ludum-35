/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="shape.ts" />
/// <reference path="weapon.ts" />
/// <reference path="resources.ts" />
/// <reference path="config.ts" />
/// <reference path="stateful.ts" />
/// <reference path="gamestate.ts" />

interface ShipState {
   shieldType: Shape;
   weapon: Weapon;
}

class Ship extends ex.Actor implements Stateful<ShipState>, Poolable {
   private _circle: ex.Animation;
   private _triangle: ex.Animation;
   private _square: ex.Animation;
   private _mouseDown: boolean = false;
   
   public poolId: number;
   public state: ShipState;
   
   constructor(x, y, width, height){
      super(x, y, width, height);
      this.collisionType = ex.CollisionType.Passive;
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
      this._circle.anchor.setTo(.4, .5);
      this._square = squareSheild.getAnimationForAll(engine, 50);
      this._square.loop = true;
      this._square.anchor.setTo(.3, .5);
      this._triangle = triangleSheild.getAnimationForAll(engine, 50);
      this._triangle.loop = true;
      this._triangle.anchor.setTo(.5, .7);
      this._triangle.rotation = Math.PI/2;           
      
      ship.on('preupdate', this.preupdate);            
      ship.on('predraw', this.predraw);
      
      engine.input.pointers.primary.on('down', this._pointerDown);
      engine.input.pointers.primary.on('move', (evt: ex.Input.PointerEvent) => {
         if(this._mouseDown){
            this._pointerDown(evt);
         }
      });
      engine.input.pointers.primary.on('up', (evt: ex.Input.PointerEvent) => {
         this._mouseDown = false;
      });
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
   private _pointerDown(click: ex.Input.PointerEvent){
       //console.log(`Update: ${evt.delta}`);
      GameState.state.ship._mouseDown = true;
      var dx = click.x - GameState.state.ship.x;
      var dy = click.y - GameState.state.ship.y;
      
      if (!gameBounds.contains(new ex.Point(this.x, this.y))) {
          return;
      }
      
      GameState.state.ship.dx = dx * Config.shipSpeedScale;
      GameState.state.ship.dy = dy * Config.shipSpeedScale;
      
      GameState.state.ship.rotation = (new ex.Vector(dx, dy)).toAngle();
   }
   
   preupdate(evt: ex.PreUpdateEvent) {
      var oppVel = new ex.Vector(this.dx, this.dy).scale(-1).scale(Config.spaceFriction);
      this.dx += oppVel.x;
      this.dy += oppVel.y;
      
      this.state.weapon.update(evt.delta);
   }
   
   update(engine: ex.Engine, delta: number) {
       super.update(engine, delta);
       
       if (this.x > gameBounds.right) {
           this.x = gameBounds.right;
           this.dx = 0;
       }
       if (this.x < gameBounds.left) {
           this.x = gameBounds.left;
           this.dx = 0;
       }
       if (this.y > gameBounds.bottom) {
           this.y = gameBounds.bottom;
           this.dy = 0;
       }
       if (this.y < gameBounds.top) {
           this.y = gameBounds.top;
           this.dy = 0;
       }
       
       if(engine.input.keyboard.wasPressed(ex.Input.Keys.A)){
           this.state.shieldType = Shape.Shape1;
       } else if (engine.input.keyboard.wasPressed(ex.Input.Keys.S)){
           this.state.shieldType = Shape.Shape2;
       } else if (engine.input.keyboard.wasPressed(ex.Input.Keys.D)){
           this.state.shieldType = Shape.Shape3;
       }
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