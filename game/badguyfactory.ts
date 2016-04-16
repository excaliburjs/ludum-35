/// <reference path="../Excalibur/dist/Excalibur.d.ts" />


class BadGuyFactory {
   private _currentTime: number;
   private _futureDispatchTime: number;
   private _started: boolean = false;
   
   constructor(public frequencySeconds: number, public minEnemy, public maxEnemy){
      this._currentTime = Date.now(); 
   }
   
   update(engine: ex.Engine, delta: number) {
      if(this._started){
         this._currentTime += delta;
         if(this._currentTime >= this._futureDispatchTime){
            this.spawn(engine, ex.Util.randomIntInRange(this.minEnemy, this.maxEnemy));
            this._futureDispatchTime = this._currentTime + (this.frequencySeconds);
         }
      }
   }
   
   spawn(engine: ex.Engine, numberOfBaddies: number){
      console.log(`Dispatch ${numberOfBaddies}`);
      for(var i = 0; i < numberOfBaddies; i++){
         //todo engine.add(new BadGuy());
         
      }
   }
   
   start(){
      this._started = true;
      this._currentTime = Date.now();
      this._futureDispatchTime = this._currentTime + (this.frequencySeconds);      
   } 
   
   stop(){
      this._started = false;
   }
   
}