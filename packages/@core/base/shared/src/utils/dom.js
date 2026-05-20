export function getElementVisibleRect(element) {
  if (!element) {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    };
  }
  const rect = element.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight,
  );
  const top = Math.max(rect.top, 0);
  const bottom = Math.min(rect.bottom, viewHeight);
  const viewWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth,
  );
  const left = Math.max(rect.left, 0);
  const right = Math.min(rect.right, viewWidth);
  if (top >= viewHeight || bottom <= 0 || left >= viewWidth || right <= 0) {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    };
  }
  return {
    bottom,
    height: Math.max(0, bottom - top),
    left,
    right,
    top,
    width: Math.max(0, right - left),
  };
}
export function getScrollbarWidth() {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.visibility = 'hidden';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  document.body.append(scrollDiv);
  const innerDiv = document.createElement('div');
  scrollDiv.append(innerDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - innerDiv.offsetWidth;
  scrollDiv.remove();
  return scrollbarWidth;
}
export function needsScrollbar() {
  const doc = document.documentElement;
  const body = document.body;
  const overflowY = window.getComputedStyle(body).overflowY;
  if (overflowY === 'scroll' || overflowY === 'auto') {
    return doc.scrollHeight > window.innerHeight;
  }
  return doc.scrollHeight > window.innerHeight;
}
export function triggerWindowResize() {
  const resizeEvent = new Event('resize');
  window.dispatchEvent(resizeEvent);
}
