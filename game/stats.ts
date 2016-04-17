/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="stateful.ts" />
/// <reference path="resources.ts" />



// keep game stats here, score, powerup level, etc

interface StatState {
   value : string|number;
}

class Stat implements Stateful<StatState>{
   public state: StatState;
   constructor(private name: string, private defaultValue : string|number) {
      this.reset();
      this.state.value = defaultValue;
   }   

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
   constructor (public stat: Stat, x: number, y: number, width: number, height: number){
   super(x, y, width, height);  

   }
    private font : ex.SpriteFont;
      
   onInitialize(engine: ex.Engine) : void {
     super.onInitialize(engine);
     var hudStat = this;
     this.font = new ex.SpriteFont(Resources.DigitalFontSheet, " !\"#$%&'{}*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_", false, 8, 8, 32, 32);
     this.font.sprites.forEach(function(item){
       item.fill(ex.Color.Red);
     })
     hudStat.on('postdraw', this.postdraw); 
   }
   
   postdraw(evt: ex.PostDrawEvent) : void {
      this.font.draw(evt.ctx, "THINGY", 100, 100, {
        fontSize: 100,
        letterSpacing: 1.
      });
      
       this.font.draw(evt.ctx, "THINGY", 0, 0, {
               color: this.color.clone(),
               baseAlign: ex.BaseAlign.Bottom,
               textAlign: ex.TextAlign.Center,
               fontSize: 100,
               letterSpacing: 1,
               opacity: 1.0
            });
   }
   
   
}
