import type { FindOneOptions, Loaded } from '@mikro-orm/postgresql';

type FindOneMethod<T, I> = <H extends string = never, F extends string = '*', E extends string = never>(
  where: I,
  options?: FindOneOptions<T, H, F, E>,
) => Promise<Loaded<T, H, F, E> | null>;

export type { FindOneMethod };
