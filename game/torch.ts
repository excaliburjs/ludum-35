class Torch extends ex.Actor {
   
   constructor(x: number, y: number) {
      super(x, y, 53, 72);
   }
   
   onInitialize() {
      var anim = Torch.getAnimation();
      this.addDrawing('default', anim);
      this.setDrawing('default');
   }
   
   private static _anim: ex.Animation;
   static getAnimation() {
      if (!Torch._anim) {
         var ss = new ex.SpriteSheet(Resources.Torch, 4, 1, 53, 72);
         var anim = ss.getAnimationForAll(game, 100);
         anim.loop = true;
         Torch._anim = anim;
      }
      return Torch._anim;
   }
   
   static place(game: ex.Engine) {
      
      var windows = [575, 1128, 1688, 2250, 2802, 3365, 3923, 4478];
      const o = 135;
      const y = 580;
      
      for (let i = 0; i < windows.length; i++) {
         let l = windows[i] - o;
         let r = windows[i] + o;
         let tl = new Torch(l, y);
         let tr = new Torch(r, y);
      
         game.add(tl);
         game.add(tr);
      }
   }
}