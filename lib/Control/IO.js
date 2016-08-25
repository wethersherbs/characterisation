import { compose, K } from '../Util/Prelude';

// Create an IO type from a thunk.
// IO : (-> a) -> IO a
const IO = f => {
  // ap : IO (a -> b) | IO a -> IO b
  const ap = g => chain(g.map);

  // chain : IO a | (a -> IO b) -> IO b
  const chain = compose(IO)(compose(unsafePerform));

  // join : IO IO a | IO a
  const join = () => IO(() => f().unsafePerform());

  // map : IO a | (a -> b) -> IO a -> IO b
  const map = g => chain(compose(IO)(g));

  return {
    ap,
    chain,
    join,
    map,
    unsafePerform: f
  };
};

// unit : a -> IO a
export const unit = compose(IO)(K);

// unsafePerform : IO a | a
export const unsafePerform = x => x.unsafePerform();