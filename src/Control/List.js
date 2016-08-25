import {
  concat as concat_,
  compose,
  equals as eq,
  id,
  liftA2
} from '../util/prelude'

// Create a List type from an array
// List : [a] -> List a
export const List = xs => {
  // ap : List (a -> b) | List a -> List b
  const ap = ys => chain(ys.map)

  // chain : List a | (a -> List b) -> List b
  const chain = f => map(f).join()

  // join : List List a | List a
  const join = () => List(fold(concat)([])(xs))

  // concat : List a | List a -> List a
  const concat = ys => List(concat_(xs)(ys.asArray))

  // equals : Setoid a => List a | List a -> Bool
  const equals = that => {
    const ys = that.asArray

    return xs.map((_, i) => eq(xs[i])(ys[i])).every(id)
  }

  // fold : List a | (b -> a -> b) -> b -> b
  const fold = f => acc => xs => xs.reduce((acc, x) => f(acc)(x), acc)

  // map : List a | (a -> b) -> List b
  const map = compose(List)(xs.map.bind(xs))

  // sequence : Applicative f => List (f a) | f (List a)
  const sequence = traverse(id)

  // traverse : Applicative f => List a | (a -> f b) -> (a -> f a) -> f (List b)
  const traverse = f => unit => fold
    (xs => x => liftA2(append)(f(x))(xs))
    (unit([]))

  return {
    ap,
    chain,
    concat,
    equals,
    fold,
    foldr,
    join,
    map,
    sequence,
    traverse,
    type,
    asArray: xs
  }
}

// unit : a -> List a
export const unit = x => List([x])

// empty : List a
export const empty = List([])

// append : a -> [a] -> [a]
export const append = x => xs => List([... xs.asArray, x])

// cons : a -> [a] -> [a]
export const cons = x => xs => List([x, ... xs.asArray])
