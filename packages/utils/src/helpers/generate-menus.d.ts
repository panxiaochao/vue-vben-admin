import type { Router, RouteRecordRaw } from 'vue-router';
import type { MenuRecordRaw } from '@vben-core/typings';
declare function generateMenus(
  routes: RouteRecordRaw[],
  router: Router,
): MenuRecordRaw[];
export { generateMenus };
