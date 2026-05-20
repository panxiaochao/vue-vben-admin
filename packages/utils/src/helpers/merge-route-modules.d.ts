import type { RouteRecordRaw } from 'vue-router';
interface RouteModuleType {
  default: RouteRecordRaw[];
}
declare function mergeRouteModules(
  routeModules: Record<string, unknown>,
): RouteRecordRaw[];
export { mergeRouteModules };
export type { RouteModuleType };
