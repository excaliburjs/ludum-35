class Portal extends ex.Actor {
   private _closetexture: ex.Texture;
   
   constructor(public state: PortalSpawn) {
      super(state.location.x, state.location.y, 48, 48);          
      
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

      //define drawing for a portal that stays open
      var ss = new ex.SpriteSheet(tx, 5, 1, 48, 48);
      var isopenanim = ss.getAnimationForAll(game, 125);
      isopenanim.loop=true;
      this.addDrawing('default', isopenanim);
      
      //define close portal drawing
      var spritesheet = new ex.SpriteSheet(this._closetexture, 13, 1, 48, 48);
      var closeanim = spritesheet.getAnimationForAll(game, 125);  
      this.addDrawing('close', closeanim);
         
      //define opening portal drawing
      var spritesheet = new ex.SpriteSheet(this._closetexture, 13, 1, 48, 48);
      spritesheet.sprites = spritesheet.sprites.reverse();
      var openanim = spritesheet.getAnimationForAll(game, 125);  
      this.addDrawing('open', openanim);
            
      this.portalopen();
      this.delay(1400).callMethod(() => { this.setDrawing('default'); });
      
   }
   
   portalclose() {
         this.setDrawing('close');
         game.currentScene.children.forEach((a)=>{
            if(a instanceof Badguy || a instanceof Bullet){
                  if((<Badguy>a).state.shape === this.state.type || (<Bullet>a).state.shape === this.state.type){
                        a.kill();
                  }
            }   
         });
         Resources.PortalClose.play();  
   }
   
   portalopen() {
         this.setDrawing('open');
         Resources.PortalOpen.play();
   }
}