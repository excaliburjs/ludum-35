/// <reference path="../Excalibur/dist/Excalibur.d.ts" />

class EndScreen extends ex.UIActor {
   constructor(){
      super(Config.width/2 -500/2, Config.height/2 - 1000, 500, 300);
      this.anchor.setTo(.5, .5);
      
   }
   
   gameover(){
      this.moveTo(Config.width/2-this.getWidth()/2, Config.height/2-this.getHeight()/2, 300).delay(500).moveTo(Config.width/2-this.getWidth()/2, 900, 300).asPromise().then(() => {
         this.y = Config.height/2 - 1000;
      });
   }
   
   retry(){
      
   }
   
   draw(ctx: CanvasRenderingContext2D, delta: number){
      super.draw(ctx, delta);
      ctx.fillStyle = ex.Color.Azure.clone();
      ctx.fillRect(this.x, this.y, this.getWidth(), this.getHeight());
   }
}