import { filterTree, mapTree, sortTree } from '@vben-core/shared/utils';
function generateMenus(routes, router) {
  const finalRoutesMap = Object.fromEntries(
    router.getRoutes().map(({ name, path }) => [name, path]),
  );
  let menus = mapTree(routes, (route) => {
    const path = finalRoutesMap[route.name] ?? route.path ?? '';
    const { meta = {}, name: routeName, redirect, children = [] } = route;
    const {
      activeIcon,
      badge,
      badgeType,
      badgeVariants,
      hideChildrenInMenu = false,
      icon,
      link,
      order,
      title = '',
      query,
    } = meta;
    const name = title || routeName || '';
    const resultChildren = hideChildrenInMenu ? [] : (children ?? []);
    if (resultChildren.length > 0) {
      resultChildren.forEach((child) => {
        child.parents = [...(route.parents ?? []), path];
        child.parent = path;
      });
    }
    const resultPath = hideChildrenInMenu ? redirect || path : link || path;
    return {
      activeIcon,
      badge,
      badgeType,
      badgeVariants,
      icon,
      name,
      query,
      order,
      parent: route.parent,
      parents: route.parents,
      path: resultPath,
      show: !meta.hideInMenu,
      children: resultChildren,
    };
  });
  menus = sortTree(menus, (a, b) => (a?.order ?? 999) - (b?.order ?? 999));
  return filterTree(menus, (menu) => !!menu.show);
}
export { generateMenus };
