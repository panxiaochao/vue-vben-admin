import { filterTree, mapTree } from '@vben-core/shared/utils';
async function generateRoutesByFrontend(routes, roles, forbiddenComponent) {
  const finalRoutes = filterTree(routes, (route) => {
    return hasAuthority(route, roles);
  });
  if (!forbiddenComponent) {
    return finalRoutes;
  }
  return mapTree(finalRoutes, (route) => {
    if (menuHasVisibleWithForbidden(route)) {
      route.component = forbiddenComponent;
    }
    return route;
  });
}
function hasAuthority(route, access) {
  const authority = route.meta?.authority;
  if (!authority) {
    return true;
  }
  const canAccess = access.some((value) => authority.includes(value));
  return canAccess || (!canAccess && menuHasVisibleWithForbidden(route));
}
function menuHasVisibleWithForbidden(route) {
  return (
    !!route.meta?.authority &&
    Reflect.has(route.meta || {}, 'menuVisibleWithForbidden') &&
    !!route.meta?.menuVisibleWithForbidden
  );
}
export { generateRoutesByFrontend, hasAuthority };
