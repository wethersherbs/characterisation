import { id, uncurryN } from 'wi-jit'

// chain : Chain m => (a -> m b) -> m a -> m b
export const chain = f => xs => xs.chain(f)

// concat : Semigroup a => a -> a -> a
export const concat = uncurryN(xs => ys => xs.concat(ys))

// equals : Setoid a => a -> a -> Bool
export const equals = uncurryN(x => y => x.equals ? x.equals(y) : x === y)

// lift2 : Applicative f => (a -> b -> c) -> f a -> f b -> f c
export const lift2 = uncurryN(f => a => a.map(f).ap)

// map : Functor f => (a -> b) -> f a -> f b
export const map = uncurryN(f => xs => xs.map(f))

// pair : a -> b -> (a, b)
export const pair = uncurryN(a => b => [a, b])

// sequence : (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
export const sequence = uncurryN(unit => xs => xs.traverse(id, unit))

// traverse : (Applicative f, Traversable t) =>
//   (a -> f b) -> (a -> f a) -> f (t b)
export const traverse = uncurryN(f => unit => xs => xs.traverse(f)(unit))
