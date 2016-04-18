/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="shape.ts" />
/// <reference path="weapon.ts" />
/// <reference path="resources.ts" />
/// <reference path="config.ts" />
/// <reference path="stateful.ts" />
/// <reference path="gamestate.ts" />
/// <reference path="game.ts" />


interface ShipState {
   shieldType: Shape;
   weapon: Weapon;
   circlePool: number;
   squarePool: number;
   trianglePool: number;
   health: number;
}

class Ship extends ex.Actor implements Stateful<ShipState>, Poolable, Pausable {
   private _circle: ex.Animation;
   private _triangle: ex.Animation;
   private _square: ex.Animation;
   
   private _rightAnim: ex.Animation;
   private _leftAnim: ex.Animation;
   
   private _mouseDown: boolean = false;
   private _currentTime: number = 0;
   
   public poolId: number;
   public state: ShipState;   
   public paused: boolean = false;
   
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
      this.setZIndex(2);
      var witchSheet = new ex.SpriteSheet(Resources.WitchSpriteSheet, 2, 1, 48, 48);
      var squareSheild = new ex.SpriteSheet(Resources.SquareShieldSheet, 5, 1, 96, 96);      
      var circleSheild = new ex.SpriteSheet(Resources.CircleShieldSheet, 5, 1, 96, 96);
      var triangleSheild = new ex.SpriteSheet(Resources.TriangleShieldSheet, 5, 1, 96, 96);
      var ship = this;
      
      this._leftAnim = witchSheet.getAnimationForAll(engine, 300);
      this._leftAnim.rotation = -Math.PI/8;
      this._leftAnim.flipVertical = true;
      this._leftAnim.loop = true;
      this._leftAnim.anchor.setTo(.1, .1);
      this.addDrawing('left', this._leftAnim);
      
      this._rightAnim = witchSheet.getAnimationForAll(engine, 300);
      this._rightAnim.rotation = Math.PI/8;
      this._rightAnim.loop = true;
      this._rightAnim.anchor.setTo(.5, .5);
      this.addDrawing('right', this._rightAnim);
      
      
      this._circle = circleSheild.getAnimationForAll(engine, 50);
      this._circle.loop = true;
      this._circle.anchor.setTo(.4, .5);
      this._square = squareSheild.getAnimationForAll(engine, 50);
      this._square.loop = true;
      this._square.anchor.setTo(.5, .5);
      this._triangle = triangleSheild.getAnimationForAll(engine, 50);
      this._triangle.loop = true;
      this._triangle.anchor.setTo(.5, .7);
      this._triangle.rotation = Math.PI/2;           
      
      ship.on('preupdate', this.preupdate);            
      ship.on('predraw', this.predraw);
      
      engine.input.pointers.primary.on('down', (evt: ex.Input.PointerEvent) => {
        this._pointerDown(evt);   
      });
      engine.input.pointers.primary.on('move', (evt: ex.Input.PointerEvent) => {
         if(this._mouseDown){
            this._pointerDown(evt);
         }
      });
      engine.input.pointers.primary.on('up', (evt: ex.Input.PointerEvent) => {
         this._mouseDown = false;
      });
   }
   
   reset(state?: ShipState) { //TODO calling this on an existing ship breaks the mouse input
      if (!state) {
         this.state = {
            shieldType: Shape.Shape1,
            weapon: new StraightShooter(this, Config.bullets.speed, Config.bullets.damage),
            squarePool: 0,
            circlePool: 0,
            trianglePool: 0,
            health: Config.playerHealth
         }
      } else {
         this.state = state;
      }
      return this;
   }
   private _pointerDown(click: ex.Input.PointerEvent){
       if (this.paused) return false;
       
       if (!this.isKilled()) {
            //console.log(`Update: ${evt.delta}`);
            GameState.state.ship._mouseDown = true;
            var dx = click.x - GameState.state.ship.x;
            var dy = click.y - GameState.state.ship.y;
            
            if (!gameBounds.contains(new ex.Point(this.x, this.y))) {
                return false;
            }
            
            var clampDx = ex.Util.clamp(dx * Config.shipSpeedScale, Config.playerMinVelocity, Config.playerMaxVelocity);
            var clampDy = ex.Util.clamp(dy * Config.shipSpeedScale, Config.playerMinVelocity, Config.playerMaxVelocity);
            
            GameState.state.ship.dx = clampDx;
            GameState.state.ship.dy = clampDy;
            
            GameState.state.ship.rotation = (new ex.Vector(dx, dy)).toAngle();
       }
   }
   
   preupdate(evt: ex.PreUpdateEvent) {
       if (this.paused) return false;
       
      var oppVel = new ex.Vector(this.dx, this.dy).scale(-1).scale(Config.spaceFriction);
      this.dx += oppVel.x;
      this.dy += oppVel.y;
      
      if(this.dx >= 0){
          this.setDrawing('right');
      }else{
          this.setDrawing('left');
      }
      
      
   }
   
   update(engine: ex.Engine, delta: number) {
       if (this.paused) return;
       
       super.update(engine, delta);
       
       this.state.weapon.update(delta);
       
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
       this._currentTime += delta;
       if(engine.input.keyboard.wasPressed(ex.Input.Keys.A)){
           this._switchShield(Shape.Shape1);
       } else if (engine.input.keyboard.wasPressed(ex.Input.Keys.S)){
           this._switchShield(Shape.Shape2);
       } else if (engine.input.keyboard.wasPressed(ex.Input.Keys.D)){
           this._switchShield(Shape.Shape3);
       }
       
   }
   
   private _switchShield(shape: Shape){
       
       if(this._currentTime > Config.ShieldCoolDownTime){
          this._currentTime = 0;
          this.state.shieldType = shape;
          Resources.On.play();
          // play bling sound
       }else{
          // play nah-uh sound
          //Resources.No.play();
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