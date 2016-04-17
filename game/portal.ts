class Portal extends ex.Actor {
   
   constructor(public state: PortalSpawn) {
      super(state.location.x, state.location.y);          
      
   }
   
   onInitialize() {
      this.setZIndex(1);
      this.scale.setTo(3, 3);
      
      var tx: ex.Texture;
      switch(this.state.type) {
         case Shape.Shape1:
            tx = Resources.SquarePortal;
            break;
         case Shape.Shape2:
            tx = Resources.CirclePortal;
            break;
         case Shape.Shape3:
            tx = Resources.TrianglePortal;
            break;
      }
      var ss = new ex.SpriteSheet(tx, 5, 1, 48, 48);
      var anim = ss.getAnimationForAll(game, 125);
      anim.loop=true;
      
      this.addDrawing('default', anim);
      this.setDrawing('default');
   }
}