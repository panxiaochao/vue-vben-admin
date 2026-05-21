import type { VxeGridProps } from '#/adapter/vxe-table';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteById, list } from '#/api/system-plus/permission/org';

export namespace SystemPlusOrgModuleNs {
  export interface SystemPlusOrg {
    [key: string]: any;
    address: string | undefined;
    areaCode?: string | undefined;
    areaId?: string | undefined;
    fax: string | undefined;
    id: number | undefined;
    mobile: string | undefined;
    orgCategory: string | undefined;
    orgCategoryStr?: string | undefined;
    orgCode: string | undefined;
    orgName: string | undefined;
    orgNameAbbr: string | undefined;
    orgNameEn: string | undefined;
    parentId: number | undefined;
    remark: string | undefined;
    sort: number | undefined;
    status: string | undefined;
  }
}

/**
 * 字段定义，获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 */
function useColumns(): VxeGridProps<SystemPlusOrgModuleNs.SystemPlusOrg>['columns'] {
  return [
    { type: 'seq', width: 70 },
    {
      title: '机构名称',
      field: 'orgName',
      treeNode: true,
      width: 200,
    },
    {
      title: '状态',
      field: 'status',
      slots: {
        default: 'status',
      },
      width: 100,
    },
    {
      title: '机构类别',
      field: 'orgCategoryStr',
      slots: { default: 'orgCategoryStr' },
      width: 100,
    },
    {
      title: '机构编码',
      field: 'orgCode',
    },
    {
      title: '地址',
      field: 'address',
    },

    { title: '排序', field: 'sort' },
    {
      field: 'action',
      title: '操作',
      width: 200,
      slots: { default: 'action' },
    },
  ];
}

const gridOptions: VxeGridProps<SystemPlusOrgModuleNs.SystemPlusOrg> = {
  columns: useColumns(),
  data: [],
  // loading: false,
  height: 'auto',
  stripe: true,
  pagerConfig: {
    enabled: false,
  },
  toolbarConfig: {
    custom: true,
    refresh: {
      queryMethod: (params) => {
        return loadData(params);
      },
    },
    resizable: true,
    zoom: true,
  },
  treeConfig: {
    // 对于同一级的节点，每次只能展开一个
    // 重点：accordion这个字段和setAllTreeExpand有冲突，因为accordion为true时，只能展示一层
    // accordion: true,
    rowField: 'id',
    parentField: 'parentId',
    transform: true,
  },
};

export const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

export const formatStatus = (row: SystemPlusOrgModuleNs.SystemPlusOrg) => {
  return row.status === '1' ? '正常' : '禁用';
};

// 自定义方法
export const onDelete = (row: SystemPlusOrgModuleNs.SystemPlusOrg) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    loadData();
  });
};

export const loadData = (params?: object) => {
  gridApi.setLoading(true);
  list(params)
    .then((res) => {
      gridApi.setGridOptions({ data: res });
    })
    .finally(() => {
      gridApi.setLoading(false);
    });
};

// 表单处理完成做刷新处理
export const formDone = () => {
  loadData();
};

// 展开所有
export const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

// 收缩所有
export const collapseAll = () => {
  gridApi.grid?.clearTreeExpand();
};
