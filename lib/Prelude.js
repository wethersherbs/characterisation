import { curry, flip, uncurryN, uncurry } from 'wi-jit';

// chain : Chain m => (a -> m b) -> m a -> m b
export const chain = uncurryN(flip(xs => xs.chain));

// concat : Semigroup m => m a -> m a -> m a
export const concat = uncurryN(xs => ys => xs.concat(ys));

// cons : a -> [a] -> [a]
export const cons = uncurryN(x => xs => [x, ...xs]);

// lift2 : Applicative f => (a -> b -> c) -> f a -> f b -> f c
export const lift2 = uncurryN(f => a => b => a.map(f).ap(b));

// map : Functor f => (a -> b) -> f a -> f b
export const map = uncurryN(flip(xs => xs.map));

// pair : a -> b -> (a, b)
export const pair = uncurryN(a => b => [a, b]);

// sequence : (Traversable t, Applicative f) => (a -> f a) -> t (f a) -> f (t a)
export const sequence = uncurryN(flip(xs => xs.sequence));

// :O Don't tell anyone

Array.prototype.chain = function (f) {
  return this.map(f).reduce(curry(concat));
};

Array.prototype.map = function (fs) {
  return fs.chain(f => this.map(f));
};

Array.prototype.sequence = function (unit) {
  return this.reduceRight(uncurry(lift2(cons)), unit([]));
};