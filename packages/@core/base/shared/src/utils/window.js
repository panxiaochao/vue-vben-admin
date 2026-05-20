function openWindow(url, options = {}) {
  const { noopener = true, noreferrer = true, target = '_blank' } = options;
  const features = [noopener && 'noopener=yes', noreferrer && 'noreferrer=yes']
    .filter(Boolean)
    .join(',');
  window.open(url, target, features);
}
function openRouteInNewWindow(path) {
  const { hash, origin } = location;
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${origin}${hash && !fullPath.startsWith('/#') ? '/#' : ''}${fullPath}`;
  openWindow(url, { target: '_blank' });
}
export { openRouteInNewWindow, openWindow };
