class Background extends ex.Actor {
   
   constructor() {
      super(0, 0, 5000, 960);
      this.anchor.setTo(0, 0);
   }
   
   onInitialize() {
      this.addDrawing(Resources.PlanetBg);
   }
}