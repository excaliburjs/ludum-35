interface Stateful<T> {
   id: number;
   state: T;
   reset(state?: T): this;
}