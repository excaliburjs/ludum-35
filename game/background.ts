class Background extends ex.Actor {
   
   constructor() {
      super(0, 0, 50, 50, ex.Color.Red);
   }
   
   update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      var pdx = -GameState.state.ship.dx;
      var pdy = -GameState.state.ship.dy;
      
      this.dx = pdx*0.1;
      this.dy = pdy*0.1;
   }
}