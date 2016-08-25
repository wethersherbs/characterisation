import { compose, id } from '../util/prelude';

// Create a Future type from a binary function
// Future : ((e -> b) -> (a -> b) -> b) -> Future e a
export const Future = x => {
  // ap : Future e (a -> b) | Future e a -> Future e b
  const ap = b => chain(b.map);

  // bimap : Future e a | (e -> f) -> (a -> b) -> Future f b
  const bimap = f => g => Future(rej => res => x.fork(compose(f)(rej))(compose(g)(res)));

  // chain : Future e a | (a -> Future e b) -> Future e b
  const chain = f => Future(rej => res => f(x).fork(rej)(res));

  // join : Future e (Future e a) | Future e a
  const join = () => Future(rej => res => x.fork(rej, y => y.fork(rej, res)));

  // map : Future e a | (a -> b) -> Future e b
  const map = bimap(id);

  return { ap, bimap, chain, join, map };
};

// unit : a -> Future e a
export const unit = x => Future(rej => res => res(x));