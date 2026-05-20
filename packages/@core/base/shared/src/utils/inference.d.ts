import { isFunction, isObject, isString } from '@vue/shared';
declare function isUndefined(value?: unknown): value is undefined;
declare function isBoolean(value: unknown): value is boolean;
declare function isEmpty<T = unknown>(value?: T): value is T;
declare function isHttpUrl(url?: string): boolean;
declare function isWindow(value: any): value is Window;
declare function isMacOs(): boolean;
declare function isWindowsOs(): boolean;
declare function isNumber(value: any): value is number;
declare function getFirstNonNullOrUndefined<T>(
  ...values: (null | T | undefined)[]
): T | undefined;
export {
  getFirstNonNullOrUndefined,
  isBoolean,
  isEmpty,
  isFunction,
  isHttpUrl,
  isMacOs,
  isNumber,
  isObject,
  isString,
  isUndefined,
  isWindow,
  isWindowsOs,
};
