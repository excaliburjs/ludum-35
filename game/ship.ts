/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
class Ship extends ex.Actor {
   constructor(x, y, width, height){
      super(x, y, width, height);
      this.color = ex.Color.Red.clone();
      this.onInitialize = (engine: ex.Engine) => {
         //initialize ship 
      }
   }
   
   
   
   
   
}