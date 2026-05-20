export declare function to<T, U = Error>(
  promise: Readonly<Promise<T>>,
  errorExt?: object,
): Promise<[null, T] | [U, undefined]>;
