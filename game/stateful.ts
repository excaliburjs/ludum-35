interface Poolable {
   poolId: number;
}
interface Stateful<T> {
   state: T;
   reset(state?: T): this;
}