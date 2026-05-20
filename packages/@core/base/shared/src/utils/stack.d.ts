export declare class Stack<T> {
  get size(): number;
  private readonly dedup;
  private items;
  private readonly maxSize?;
  constructor(dedup?: boolean, maxSize?: number);
  clear(): void;
  peek(): T | undefined;
  pop(): T | undefined;
  push(...items: T[]): void;
  remove(...itemList: T[]): void;
  retain(itemList: T[]): void;
  toArray(): T[];
}
export declare const createStack: <T>(
  dedup?: boolean,
  maxSize?: number,
) => Stack<T>;
