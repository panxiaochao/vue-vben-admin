import { isFunction, isObject, isString } from 'vue';
function isUndefined(value) {
  return value === undefined;
}
function isBoolean(value) {
  return typeof value === 'boolean';
}
function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  if (Array.isArray(value) || isString(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }
  return false;
}
function isHttpUrl(url) {
  if (!url) {
    return false;
  }
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}
function isWindow(value) {
  return (
    typeof window !== 'undefined' && value !== null && value === value.window
  );
}
function isMacOs() {
  const macRegex = /macintosh|mac os x/i;
  return macRegex.test(navigator.userAgent);
}
function isWindowsOs() {
  const windowsRegex = /windows|win32/i;
  return windowsRegex.test(navigator.userAgent);
}
function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}
function getFirstNonNullOrUndefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}
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
