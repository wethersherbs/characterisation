// compose : (b -> c) -> (a -> b) -> a -> c
export const compose = f => g => x => f(g(x))

// concat : Semigroup a => a -> a -> a
export const concat = xs => ys => xs.concat(ys)

// equals : Setoid a => a -> a -> Bool
export const equals = x => y =>
    x.equals ? x.equals(y) : x === y

// id : a -> a
export const id = x => x

// join : Monad m => m m a -> m a
export const join = m => m.join()

// K : a -> b -> a
export const K = x => _ => x

// liftA2 : Applicative f => (a -> b -> c) -> f a -> f b -> f c
export const liftA2 = f => a => a.map(f).ap

// sequence : (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
export const sequence = unit => xs => xs.sequence(unit)

// traverse : (Applicative f, Traversable t) =>
//   (a -> f b) -> (a -> f a) -> f (t b)
export const traverse = f => unit => xs => xs.traverse(f)(unit)
