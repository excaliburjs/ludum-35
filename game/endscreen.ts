/// <reference path="../Excalibur/dist/Excalibur.d.ts" />

class EndScreen {
   private _el: HTMLElement;
   private _restart: HTMLElement;
   private _score: HTMLElement;
   constructor(public endScreenId: string = "gameover", 
               public restartId: string = "restart",
               public scoreId: string = "score"){
      this._el = document.getElementById(this.endScreenId);
      this._score = document.getElementById(this.scoreId);
      this._restart = document.getElementById(this.restartId);
      this._restart.onclick = this.restart.bind(this);
   }
   
   public win(){
      pause();
      this._score.innerText = `Score: ${GameState.getGameStat("KILLS")}`;
      this._show();
      removeClass(this._el, "lose");
      addClass(this._el, "win");
   }
   
   public lose(){
      pause();
      this._score.innerText = `Score: ${GameState.getGameStat("KILLS")}`;
      this._show();
      removeClass(this._el, "win");
      addClass(this._el, "lose");
   }
   
   public restart(){      
      GameState.reset();
      this._hide();
      resume();
   }   
   
   private _hide() {
      addClass(this._el, "hidden");
   }
   private _show() {
      removeClass(this._el, "hidden");
   }
}