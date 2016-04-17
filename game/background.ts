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
   constructor() {
      super(0, -100, 10000, 1920);
      this.anchor.setTo(0, 0);
   }
   
   onInitialize() {
      this.addDrawing(Resources.FrontBg);
   }
   
   update(engine, delta) {
      super.update(engine, delta);
      
      var pdx = GameState.state.ship.dx;
      var pdy = GameState.state.ship.dy;
      
      this.dx = -pdx;
      this.dy = -pdy;
   }
}