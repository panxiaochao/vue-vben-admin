import { computed, getCurrentInstance, unref, useAttrs, useSlots } from 'vue';
import {
  getFirstNonNullOrUndefined,
  kebabToCamelCase,
} from '@vben-core/shared/utils';
export function usePriorityValue(key, props, state) {
  const instance = getCurrentInstance();
  const slots = useSlots();
  const attrs = useAttrs();
  const value = computed(() => {
    const rawProps = instance?.vnode?.props || {};
    const standardRawProps = {};
    for (const [key, value] of Object.entries(rawProps)) {
      standardRawProps[kebabToCamelCase(key)] = value;
    }
    const propsKey =
      standardRawProps?.[key] === undefined ? undefined : props[key];
    return getFirstNonNullOrUndefined(
      slots[key],
      attrs[key],
      propsKey,
      state?.value?.[key],
    );
  });
  return value;
}
export function usePriorityValues(props, state) {
  const result = {};
  Object.keys(props).forEach((key) => {
    result[key] = usePriorityValue(key, props, state);
  });
  return result;
}
export function useForwardPriorityValues(props, state) {
  const computedResult = {};
  Object.keys(props).forEach((key) => {
    computedResult[key] = usePriorityValue(key, props, state);
  });
  return computed(() => {
    const unwrapResult = {};
    Object.keys(props).forEach((key) => {
      unwrapResult[key] = unref(computedResult[key]);
    });
    return unwrapResult;
  });
}
