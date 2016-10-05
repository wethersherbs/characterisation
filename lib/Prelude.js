import { curry, flip, id, uncurryN, uncurry } from 'wi-jit';

// chain : Chain m => (a -> m b) -> m a -> m b
export const chain = uncurryN(f => xs => xs.chain(f));

// concat : Semigroup m => m a -> m a -> m a
export const concat = uncurryN(xs => ys => xs.concat(ys));

// cons : a -> [a] -> [a]
export const cons = uncurryN(x => xs => [x, ...xs]);

// lift2 : Applicative f => (a -> b -> c) -> f a -> f b -> f c
export const lift2 = uncurryN(f => a => b => b.ap(a.map(f)));

// map : Functor f => (a -> b) -> f a -> f b
export const map = uncurryN(f => xs => xs.map(f));

// pair : a -> b -> (a, b)
export const pair = uncurryN(a => b => [a, b]);

// sequence : (Traversable t, Applicative f) => (a -> f a) -> t (f a) -> f (t a)
export const sequence = uncurryN(unit => xs => xs.sequence(unit));

// :O Don't tell anyone
Array.prototype.ap = function (fs) {
  return fs.chain(f => this.map(f));
};

Array.prototype.chain = function (f) {
  return this.map(f).reduce((acc, x) => concat(acc, x), []);
};

Array.prototype.sequence = function (unit) {
  return this.reduceRight((acc, x) => lift2(cons, x, acc), unit([]));
};