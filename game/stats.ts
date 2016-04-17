/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="stateful.ts" />


// keep game stats here, score, powerup level, etc

interface StatState {
   value : string|number;
}

class Stat implements Stateful<StatState>{
   constructor(private name: string, private defaultValue : string|number) {
      this.state.value = defaultValue;
   }   
   public state: StatState;
   public reset(state?: StatState) : this {
      if (!state) {
         this.state = {
            value: this.defaultValue
         }
      } else {
         this.state = state;
      }
      return this;
   }
}

class HUDStat extends ex.UIActor {
   constructor (public stat: Stat,x: number, y: number, width: number, height: number){
   super(x, y, width, height)
   }
   
   onInitialize() : void {
     var hudStat = this;
     hudStat = this.stat.state.value;
     hudsStat.on('postdraw', postdraw); 
   }
   
   postdraw() : void {
      
   }
   
   
}
