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
      
      var newBullet = new Bullet();
      newBullet.reset({
         owner: this.source,
         d: ex.Vector.fromAngle(this.source.rotation),
         damage: this.damage,
         x: this.source.x,
         y: this.source.y,
         speed: this.speed + Config.playerMaxVelocity,
         shape: Shape.PlayerBullet,
         scale: 2
      });
      game.add(newBullet);
   }
   
}

class ShapeShooter extends WeaponBase {
      
   constructor(protected source: ex.Actor, public speed: number, public damage: number, public badguyType: Shape) { 
      super(Config.BadguyShooterFrequency, source);
   }
   
   shoot() {
      var player = GameState.state.ship;
      var target = new ex.Vector(player.x, player.y);
      var randomAngle = ex.Util.randomInRange(0, Math.PI*2);
      var missFactor = new ex.Vector(Config.badguy.missRadius * Math.cos(randomAngle), Config.badguy.missRadius * Math.sin(randomAngle));
      target = target.add(missFactor);
      
      var direction = target.minus(new ex.Vector(this.source.x, this.source.y));
      
      var newBullet = new Bullet();
      
      // spawn bullet traveling in direction actor is facing
      newBullet.reset({
         owner: this.source,
         d: direction,
         damage: this.damage,
         x: this.source.x,
         y: this.source.y,
         speed: this.speed,
         shape: this.badguyType,
         scale: .5
      });
      
      game.add(newBullet);
   }
   
}