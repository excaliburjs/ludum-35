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
      public getStatName(): string {
        return this.name;
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
      this.visible = Config.HUDStatVisible
   }
    private font : ex.SpriteFont;
    private statLabel: ex.Label;
    
      
   onInitialize(engine: ex.Engine) : void {
     super.onInitialize(engine);
     var hudStat = this;
     this.font = new ex.SpriteFont(Resources.DiabloFontSheet, " !\"#$%&'{}*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_", false, 8, 8, 32, 32);
     var displayText = this.stat.getStatName() + ":" + this.stat.state.value;
     this.statLabel = new ex.Label(displayText, 0, 0, null, this.font);
     this.statLabel.fontSize = 60;
     this.statLabel.letterSpacing = -38;
     this.statLabel.color = ex.Color.Magenta.clone();
     this.add(this.statLabel);
     hudStat.on('postdraw', this.postdraw); 
   }
   
   postdraw(evt: ex.PostDrawEvent) : void {
     this.statLabel.text = this.stat.getStatName() + ":" + this.stat.state.value;
   }
}

class PortalStat extends ex.UIActor {
  
  static width = 100;
  static height = 15;
  
  constructor(x: number, y: number, public type: Shape) {
    super(x, y, PortalStat.width, PortalStat.height);
  }
  
  private _color: ex.Color;
  private _sprite: ex.Sprite;
  private _filledPerc: number;
  
  onInitialize(engine) {
    super.onInitialize(engine);
    
    switch (this.type) {
      case Shape.Shape1:
        this._color = Config.colorShape1;
        this._sprite = new ex.SpriteSheet(Resources.SquareBullet, 3, 1, 32, 32).getSprite(1);
        break;
      case Shape.Shape2:
        this._color = Config.colorShape2;
        this._sprite = new ex.SpriteSheet(Resources.CircleBullet, 3, 1, 32, 32).getSprite(1);
        break;
      case Shape.Shape3:
        this._color = Config.colorShape3;
        this._sprite = new ex.SpriteSheet(Resources.TriangleBullet, 3, 1, 32, 32).getSprite(1);
        break;
    }
    
    this._sprite.scale.setTo(0.75, 0.75);
  }
  
  update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    
    // find all portals of this type     
    var wave = badGuyFactory.getWave();
    
    var totalCloseNeeded = _.chain(wave.portals).filter(p => p.type === this.type).sum(p => p.closeAmount);
    var currentAmount = 0;
    
    if (totalCloseNeeded <= 0) {
      // portal is not in wave, hide stat
      this.visible = false;
    } else {
      this.visible = true;
    }
    
    switch (this.type) {
      case Shape.Shape1:
        currentAmount=GameState.state.ship.state.squarePool;
        break;
      case Shape.Shape2:
        currentAmount=GameState.state.ship.state.circlePool;
        break;
      case Shape.Shape3:
        currentAmount=GameState.state.ship.state.trianglePool;
        break;
    }
    
    this._filledPerc = Math.min(1, currentAmount / totalCloseNeeded);
  }
  
  draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
               
    if (!this.visible) return;
               
    // background
    ctx.fillStyle = ex.Color.fromRGB(this._color.r, this._color.g, this._color.b, 0.3).toString();
    ctx.fillRect(this.x, this.y, PortalStat.width, PortalStat.height);
    ctx.strokeStyle = this._color.toString();
    ctx.strokeRect(this.x, this.y, PortalStat.width, PortalStat.height);
    
    // fill in
    ctx.fillStyle = this._color.toString();
    ctx.fillRect(this.x, this.y, Math.floor(PortalStat.width * this._filledPerc), PortalStat.height);
    
    this._sprite.draw(ctx, this.x - 16, this.y - (this.getHeight()/2) + 3);
  }
}