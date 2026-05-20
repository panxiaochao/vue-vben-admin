export function getPopupContainer(node) {
  return node?.closest('form') ?? node?.parentNode ?? document.body;
}
