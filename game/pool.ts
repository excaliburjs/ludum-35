/// <reference path="shape.ts" />
/// <reference path="stateful.ts" />
/// <reference path="gamestate.ts" />

class Pool<T extends Stateful<U>, U> {
   
   private _pool: T[];
   private _free: number[] = [];
   private _nextFree: number = 0;
   
   constructor(private _poolSize: number, private factory: () => T) {
      this._pool = new Array(_poolSize);
      this._free = new Array(_poolSize);
      this._nextFree = this._pool.length - 1;
   }   
   
   fill(start: number = 0) {              
      for(let i = start; i < this._poolSize; i++) {         
         let o = this.factory();
         o.id = i;
         this._pool[i] = o;            
         this._free[i] = i;
      }
   }
        
   spawn(state: U) {
      var i = this._next();
      
      this._pool[i].reset(state);
   }
   
   despawn(obj: Stateful<BulletState>) {
      if (!obj) return;
      obj.reset();
      this._free[this._nextFree] = obj.id;
   }
     
   private _next(): number {
                 
      // pop off stack
      var pop = this._free[this._nextFree];
      
      // decrement stack counter
      this._nextFree--;
      
      if (this._nextFree < 0) {
         this._resize();
      }
      
      return pop;
   }
   
   private _resize(): void {
      
      ex.Logger.getInstance().debug("[Pool] resizing pool, old:", this._poolSize)
      
      var oldSize = this._poolSize;
      
      // double pool size
      this._poolSize += this._poolSize;
      
      // re-allocate pool
      var tempPool = new Array(this._poolSize);
      var tempFree = new Array(this._poolSize);
      
      // copy arrays
      for(let i = 0; i < this._pool.length; i++) {
         tempPool[i] = this._pool[i];
         tempFree[i] = this._free[i];
      }
      
      this._pool = tempPool;
      this._free = tempFree;
      
      // refill
      this.fill(oldSize);
      
      // move stack pointer
      this._nextFree = this._poolSize - 1;
   }
}
