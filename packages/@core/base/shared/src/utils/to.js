export async function to(promise, errorExt) {
  try {
    const data = await promise;
    const result = [null, data];
    return result;
  } catch (error) {
    if (errorExt) {
      const parsedError = Object.assign({}, error, errorExt);
      return [parsedError, undefined];
    }
    return [error, undefined];
  }
}
