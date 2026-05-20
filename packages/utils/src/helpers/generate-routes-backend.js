import { mapTree } from '@vben-core/shared/utils';
function menuHasVisibleWithForbidden(route) {
  return !!route.meta?.menuVisibleWithForbidden;
}
async function generateRoutesByBackend(options) {
  const {
    fetchMenuListAsync,
    layoutMap = {},
    pageMap = {},
    forbiddenComponent,
  } = options;
  try {
    const menuRoutes = await fetchMenuListAsync?.();
    if (!menuRoutes) {
      return [];
    }
    const normalizePageMap = {};
    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value;
    }
    let routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap);
    if (forbiddenComponent) {
      routes = mapTree(routes, (route) => {
        if (menuHasVisibleWithForbidden(route)) {
          route.component = forbiddenComponent;
        }
        return route;
      });
    }
    return routes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
function convertRoutes(routes, layoutMap, pageMap) {
  return mapTree(routes, (node) => {
    const route = node;
    const { component, name } = node;
    if (!name) {
      console.error('route name is required', route);
    }
    if (component && layoutMap[component]) {
      route.component = layoutMap[component];
    } else if (component) {
      const normalizePath = normalizeViewPath(component);
      const pageKey = normalizePath.endsWith('.vue')
        ? normalizePath
        : `${normalizePath}.vue`;
      if (pageMap[pageKey]) {
        route.component = pageMap[pageKey];
      } else {
        console.error(`route component is invalid: ${pageKey}`, route);
        route.component = pageMap['/_core/fallback/not-found.vue'];
      }
    }
    return route;
  });
}
function normalizeViewPath(path) {
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;
  return viewPath.replace(/^\/views/, '');
}
export { generateRoutesByBackend };
