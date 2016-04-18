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
      this._el.classList.remove("hidden");
   }
   
   public lose(){
      // todo
   }
   
   public restart(){
      // todo game restart  
      GameState.reset();
      this._el.classList.add("hidden");
      resume();
   }   
   
}