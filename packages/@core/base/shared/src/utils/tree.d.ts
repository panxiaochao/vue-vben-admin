interface TreeConfigOptions {
  childProps: string;
}
declare function traverseTreeValues<T, V>(
  tree: T[],
  getValue: (node: T) => V,
  options?: TreeConfigOptions,
): V[];
declare function filterTree<T extends Record<string, any>>(
  tree: T[],
  filter: (node: T) => boolean,
  options?: TreeConfigOptions,
): T[];
declare function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T) => V,
  options?: TreeConfigOptions,
): V[];
declare function sortTree<T extends Record<string, any>>(
  treeData: T[],
  sortFunction: (a: T, b: T) => number,
  options?: TreeConfigOptions,
): T[];
export { filterTree, mapTree, sortTree, traverseTreeValues };
