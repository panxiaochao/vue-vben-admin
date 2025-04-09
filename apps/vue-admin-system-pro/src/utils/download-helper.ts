/**
 * 解析Content-Disposition头部字段，提取文件名
 * @param contentDisposition Content-Disposition头部字段
 * @param defaultFileName  默认文件名，可选参数
 * @returns 解析后的文件名
 */
export function parseContentDispositionForFileName(
  contentDisposition: string,
  // 将 defaultFileName 设置为可选参数，并提供默认值
  defaultFileName: string = 'unknown',
): string {
  // 输入校验
  if (contentDisposition && contentDisposition.trim() === '') {
    return defaultFileName;
  }

  // 提取正则表达式为常量，便于维护
  const rfc5987Pattern = /filename\*=UTF-8''([^;]+)/;
  const traditionalPattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

  // 尝试匹配 RFC 5987 格式
  const matchRfc5987 = contentDisposition.match(rfc5987Pattern);
  if (matchRfc5987) {
    const rfc5987FileName = matchRfc5987[1];
    if (rfc5987FileName) {
      try {
        // 解码 URI 并捕获异常
        return decodeURIComponent(rfc5987FileName);
      } catch {
        // 如果解码失败，返回默认值
        return defaultFileName;
      }
    }
  }
  // 尝试匹配传统格式
  const matchTraditional = contentDisposition.match(traditionalPattern);
  if (matchTraditional && matchTraditional[1]) {
    return matchTraditional[1].replaceAll(/['"]/g, '');
  }
  // 如果未解析到文件名，返回默认值
  return defaultFileName;
}
