class Background extends ex.Actor {
   
   constructor() {
      super(0, 0, 5000, 960);
      this.anchor.setTo(0, 0);
   }
   
   onInitialize() {
      this.addDrawing(Resources.PlanetBg);
   }
}

class Frontground extends ex.Actor {
   private _yPos = -100;
   private _maxHeight = 1920;
   constructor() {
      super(0, -100, 10000, 1920);
      this.anchor.setTo(0, 0);
   }
   
   onInitialize() {
      this.setZIndex(3);
      this.addDrawing(Resources.FrontBg);
   }
   
   update(engine, delta) {
      super.update(engine, delta);
      
      this.x = -GameState.state.ship.x * 1;
      this.y = -GameState.state.ship.y * 1;
      //console.log(`Ship y:${GameState.state.ship.y} Foreground y:${this.y} `)
       
      
      //var pdx = GameState.state.ship.dx;
      //var pdy = GameState.state.ship.dy;
      
      //this.dx = -pdx;
      //this.dy = -pdy;
   }
}