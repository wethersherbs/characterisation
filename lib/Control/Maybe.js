import { id, equals as eq, K } from '../Util/Prelude';

// Create a Nothing instance.
// Nothing : Maybe a
export const Nothing = function () {
  // ap : Maybe (a -> b) | Maybe a -> Maybe b
  const ap = K(Nothing);

  // chain : Maybe a | (a -> Maybe b) -> Maybe b
  const chain = K(Nothing);

  // join : Maybe Maybe a | Maybe a
  const join = K(Nothing);

  // concat : Maybe a | Maybe a -> Maybe a
  const concat = id;

  // equals : Setoid a => Maybe a | Maybe a -> Bool
  const equals = isNothing;

  // map : Functor f => Maybe a | (a -> b) -> Maybe b
  const map = K(Nothing);

  // fork : Maybe a | a -> a
  const fork = id;return { ap, chain, concat, equals, fork, map, type };
}();

// Create a Just instance.
// Just : a -> Maybe a
export const Just = x => {
  // ap : Maybe (a -> b) | Maybe a -> Maybe b
  const ap = y => chain(y.map);

  // chain : Maybe a | (a -> Maybe b) -> Maybe b
  const chain = f => f(x);

  // concat : Maybe a | Maybe a -> Maybe a
  const concat = y => isNothing(y) ? Just(x) : Just(x.concat(y.fork(null)));

  // equals : Setoid a => Maybe a | Maybe a -> Bool
  const equals = y => !isNothing(y) && eq(x)(y.fork(null));

  // fork : Maybe a | a -> a
  const fork = K(x);

  // map : Maybe a | (a -> b) -> Maybe b
  const map = f => Just(f(x));

  return { ap, chain, concat, equals, fork, map, type };
};

// unit : a -> Maybe a
export const unit = Just;

// empty : Maybe a
export const empty = Nothing;

// fork : a -> Maybe a -> a
export const fork = x => m => m.fork(x);

// isNothing : Maybe a -> Bool
export const isNothing = x => (s => x.fork(s) === s)(Symbol());