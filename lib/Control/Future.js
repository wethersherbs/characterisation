import { composeN, id, uncurryN } from 'wi-jit';
import { chain as chain_ } from '../Prelude';

export const Future = fork => {
  const bimap = uncurryN(f => g => Future(rej => res => fork(composeN(f, rej), composeN(g, res))));

  const chain = f => Future(rej => res => fork(rej, x => f(x).fork(rej, res)));

  const map = bimap(id);

  return { ap: chain_(map), bimap, chain, map, fork };
};

// unit : a -> Future e a
export const unit = x => Future(rej => res => res(x));