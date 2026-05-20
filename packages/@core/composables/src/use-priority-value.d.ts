import type { ComputedRef, Ref } from 'vue';
export declare function usePriorityValue<
  T extends Record<string, any>,
  S extends Record<string, any>,
  K extends keyof T = keyof T,
>(
  key: K,
  props: T,
  state: Readonly<Ref<NoInfer<S>>> | undefined,
): ComputedRef<T[K]>;
export declare function usePriorityValues<
  T extends Record<string, any>,
  S extends Ref<Record<string, any>> = Readonly<Ref<NoInfer<T>, NoInfer<T>>>,
>(props: T, state: S | undefined): { [K in keyof T]: ComputedRef<T[K]> };
export declare function useForwardPriorityValues<
  T extends Record<string, any>,
  S extends Ref<Record<string, any>> = Readonly<Ref<NoInfer<T>, NoInfer<T>>>,
>(props: T, state: S | undefined): ComputedRef<{ [K in keyof T]: T[K] }>;
