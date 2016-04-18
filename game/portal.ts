class Portal extends ex.Actor {
   private _closetexture: ex.Texture;
   
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
            this._closetexture = Resources.SquarePortalClose;
            break;
         case Shape.Shape2:
            tx = Resources.CirclePortal;
            this._closetexture = Resources.CirclePortalClose;
            break;
         case Shape.Shape3:
            tx = Resources.TrianglePortal;
            this._closetexture = Resources.TrianglePortalClose;
            break;
      }
      var ss = new ex.SpriteSheet(tx, 5, 1, 48, 48);
      var anim = ss.getAnimationForAll(game, 125);
      anim.loop=true;
      
      this.addDrawing('default', anim);
      this.setDrawing('default');
   }
   
   portalclose() {
         var spritesheet = new ex.SpriteSheet(this._closetexture, 13, 1, 48, 48);
         var anim = spritesheet.getAnimationForAll(game, 125);
         anim.loop = false;
         this.addDrawing('close', anim);
         this.setDrawing('close');
   }
}