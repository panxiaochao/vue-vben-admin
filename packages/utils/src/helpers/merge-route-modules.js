function mergeRouteModules(routeModules) {
  const mergedRoutes = [];
  for (const routeModule of Object.values(routeModules)) {
    const moduleRoutes = routeModule?.default ?? [];
    mergedRoutes.push(...moduleRoutes);
  }
  return mergedRoutes;
}
export { mergeRouteModules };
