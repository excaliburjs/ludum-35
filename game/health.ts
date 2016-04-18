/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="stateful.ts" />
/// <reference path="resources.ts" />
/// <reference path="gamestate.ts" />

class HealthStat extends ex.UIActor {
   private _activeHeart = new ex.SpriteSheet(Resources.Heart, 2, 1, 32, 32).getSprite(0);
   private _emptyHeart = new ex.SpriteSheet(Resources.Heart, 2, 1, 32, 32).getSprite(1);
   static width = 100;
   static height = 15;
   
   constructor(x: number, y: number) {
      super(x, y, HealthStat.width, HealthStat.height); 
   }
   
   draw(ctx: CanvasRenderingContext2D) {
      
      var heartsleft = GameState.state.ship.state.health;
      var totalhearts = Config.playerHealth;
      
      for (var i = 0; i < heartsleft; i++){
         this._activeHeart.draw(ctx, this.x - ( i * 24), this.y - (this.getHeight()/2) + 3);
      }
      
      
      for (var ii = i; ii < totalhearts; ii++){
         this._emptyHeart.draw(ctx, this.x - ( ii * 24), this.y - (this.getHeight()/2) + 3);
      }
      
   }
}