function uniqueByField(arr, key) {
  const seen = new Map();
  return arr.filter((item) => {
    const value = item[key];
    return seen.has(value) ? false : (seen.set(value, item), true);
  });
}
export { uniqueByField };
