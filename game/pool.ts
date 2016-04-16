/// <reference path="shape.ts" />
/// <reference path="stateful.ts" />
/// <reference path="gamestate.ts" />

class Pool<T extends Stateful<U>, U> {
   
   private _pool: ex.Util.Collection<T>;
   private _free: ex.Util.Collection<number>;
   
   constructor(poolSize: number, private factory: () => T) {
      this._pool = new ex.Util.Collection<T>(poolSize);
      this._free = new ex.Util.Collection<number>(poolSize);
   }   
   
   fill(count = this._pool.count()) {
      for(let i = 0; i < count; i++) {         
         let o = this.factory();
         o.id = i;
         this._pool.push(o);
         this._free.push(i);
      }
   }
        
   spawn(state: U) {
      var i = this._free.pop();
      
      // TODO dynamically resize collections and initialize
      if (i === undefined) {
          throw "Make poolSize bigger for factory: " + this.factory.toString();
      }
      
      var o = this._pool[i];
      
      if (!o) {
         o = this.factory();
         o.id = i;
         this._pool[i] = o;
      }
      this._pool[i].reset(state);
   }
   
   despawn(obj: Stateful<BulletState>) {
      if (!obj) return;
      obj.reset();
      this._free.push(obj.id);
   }     
}
