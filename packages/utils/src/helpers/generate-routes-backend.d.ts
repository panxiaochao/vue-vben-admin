import type { RouteRecordRaw } from 'vue-router';
import type { GenerateMenuAndRoutesOptions } from '@vben-core/typings';
declare function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]>;
export { generateRoutesByBackend };
