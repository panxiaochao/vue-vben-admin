function traverseTreeValues(tree, getValue, options) {
  const result = [];
  const { childProps } = options || {
    childProps: 'children',
  };
  const dfs = (treeNode) => {
    const value = getValue(treeNode);
    result.push(value);
    const children = treeNode?.[childProps];
    if (!children) {
      return;
    }
    if (children.length > 0) {
      for (const child of children) {
        dfs(child);
      }
    }
  };
  for (const treeNode of tree) {
    dfs(treeNode);
  }
  return result.filter(Boolean);
}
function filterTree(tree, filter, options) {
  const { childProps } = options || {
    childProps: 'children',
  };
  const _filterTree = (nodes) => {
    return nodes.filter((node) => {
      if (filter(node)) {
        if (node[childProps]) {
          node[childProps] = _filterTree(node[childProps]);
        }
        return true;
      }
      return false;
    });
  };
  return _filterTree(tree);
}
function mapTree(tree, mapper, options) {
  const { childProps } = options || {
    childProps: 'children',
  };
  return tree.map((node) => {
    const mapperNode = mapper(node);
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options);
    }
    return mapperNode;
  });
}
function sortTree(treeData, sortFunction, options) {
  const { childProps } = options || {
    childProps: 'children',
  };
  return treeData.toSorted(sortFunction).map((item) => {
    const children = item[childProps];
    if (children && Array.isArray(children) && children.length > 0) {
      return {
        ...item,
        [childProps]: sortTree(children, sortFunction, options),
      };
    }
    return item;
  });
}
export { filterTree, mapTree, sortTree, traverseTreeValues };
