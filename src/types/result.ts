export type Result<T, U> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: U;
    };
