/// <reference path="shape.ts" />
/// <reference path="stateful.ts" />
/// <reference path="gamestate.ts" />

class Pool<T extends ex.Actor & Stateful<U> & Poolable, U> {
   
   private _pool: ex.Util.Collection<T>;
   private _free: ex.Util.Collection<number>;
   
   constructor(poolSize: number, private factory: () => T) {
      this._pool = new ex.Util.Collection<T>(poolSize);
      this._free = new ex.Util.Collection<number>(poolSize);
   }   
   
   fill(count = this._pool.internalSize()) {
      for(let i = 0; i < count; i++) {         
         let o = this.factory();
         o.poolId = i;
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
      var actor = this._pool.elementAt(i);
      
      actor.reset(state);
      game.add(actor);
   }
   
   despawn(obj: T) {
      if (!obj) return;
      obj.reset();
      this._free.push(obj.poolId);
      game.remove(obj);
   }     
}
