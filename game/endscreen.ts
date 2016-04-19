/// <reference path="../Excalibur/dist/Excalibur.d.ts" />

class EndScreen {
   private _el: HTMLElement;
   private _restart: HTMLElement;
   private _score: HTMLElement;
   private _time: number;
   private _minutes: number;
   private _seconds: number;
   constructor(public endScreenId: string = "gameover", 
               public restartId: string = "restart",
               public scoreId: string = "score"){
      this._el = document.getElementById(this.endScreenId);
      this._score = document.getElementById(this.scoreId);
      this._restart = document.getElementById(this.restartId);
      this._restart.onclick = this.restart.bind(this);
   }
   
   public win(){
      this._gameOver();
      this._score.innerHTML = `Time: ${this._minutes.toFixed(0)}m ${this._seconds.toFixed(0)}s`;
      this._show();
      removeClass(this._el, "lose");
      addClass(this._el, "win");
   }
   
   public lose(){
      this._gameOver();
      this._score.innerHTML = `Time: ${this._minutes.toFixed(0)}m ${this._seconds.toFixed(0)}s`;
      this._show();
      removeClass(this._el, "win");
      addClass(this._el, "lose");
   }
   
   public restart(){      
      GameState.reset();
      this._hide();
      resume();
   }   
   
   private _gameOver() {
      pause();
      GameState.state.gameEnd = Date.now();
      this._time = (GameState.state.gameEnd - GameState.state.gameStart);
      this._minutes = Math.floor(this._time / 1000 / 60);
      this._seconds = Math.floor((this._time / 1000) - (60 * this._minutes));            
      
      // remove all bullets
      var bulletsToRemove = _.filter(game.currentScene.children, c => c instanceof Bullet);
      _.each(bulletsToRemove, b => game.remove(b));
   }
   
   private _hide() {
      addClass(this._el, "hidden");
   }
   private _show() {
      removeClass(this._el, "hidden");
   }
}