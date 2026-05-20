import type { RouteRecordRaw } from 'vue-router';
declare function generateRoutesByFrontend(
  routes: RouteRecordRaw[],
  roles: string[],
  forbiddenComponent?: RouteRecordRaw['component'],
): Promise<RouteRecordRaw[]>;
declare function hasAuthority(route: RouteRecordRaw, access: string[]): boolean;
export { generateRoutesByFrontend, hasAuthority };
