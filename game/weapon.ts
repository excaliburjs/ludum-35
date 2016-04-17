interface Weapon {
   
   interval: number;
   update(delta: number): void;
   shoot(): void;   
   
}

class WeaponBase implements Weapon {
   private _bulletTimer: ex.Timer;
   
   constructor(public interval: number, protected source: ex.Actor) { 
      this._bulletTimer = new ex.Timer(() => this.shoot(), interval, true);
   }
   
   update(delta: number) {
      this._bulletTimer.update(delta);
   }
   
   shoot() {
      // override
   }
}

class StraightShooter extends WeaponBase {
      
   constructor(protected source: ex.Actor, public speed: number, public damage: number) { 
      super(Config.StraightShooterFrequency, source);
   }
   
   shoot() {
      
      // spawn bullet traveling in direction actor is facing
      GameState.state.bullets.spawn({
         owner: this.source,
         d: ex.Vector.fromAngle(this.source.rotation),
         damage: this.damage,
         x: this.source.x,
         y: this.source.y,
         speed: this.speed,
         shape: Shape.PlayerBullet
      });
   }
   
}

class ShapeShooter extends WeaponBase {
      
   constructor(protected source: ex.Actor, public speed: number, public damage: number) { 
      super(1500, source);
   }
   
   shoot() {
      
      // spawn bullet traveling in direction actor is facing
      GameState.state.bullets.spawn({
         owner: this.source,
         d: ex.Vector.fromAngle(this.source.rotation),
         damage: this.damage,
         x: this.source.x,
         y: this.source.y,
         speed: this.speed,
         shape: Shape.Shape1
      });
   }
   
}