import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps, VxeTableGridOptions } from '#/adapter/vxe-table';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteById, tableTree } from '#/api/system-plus/permission/org';

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'orgName',
      label: '机构名称：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入机构名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'orgCode',
      label: '机构编码：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入机构编码',
      },
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

export namespace SystemPlusOrgModuleNs {
  export interface SystemPlusOrg {
    [key: string]: any;
    id: string | undefined;
    parentId: string | undefined;
    areaId?: string | undefined;
    areaCode?: string | undefined;
    orgName: string | undefined;
    orgNameEn: string | undefined;
    orgNameAbbr: string | undefined;
    orgCode: string | undefined;
    sort: number | undefined;
    orgCategory: number | undefined;
    orgCategoryStr?: string | undefined;
    mobile: string | undefined;
    fax: string | undefined;
    address: string | undefined;
    state: string | undefined;
    remark: string | undefined;
  }
}

/**
 * 字段定义，获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 */
function useColumns(): VxeGridProps<SystemPlusOrgModuleNs.SystemPlusOrg>['columns'] {
  return [
    {
      title: '机构名称',
      field: 'orgName',
      treeNode: true,
      width: 200,
    },
    {
      title: '状态',
      field: 'state',
      slots: {
        default: 'state',
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
      width: 120,
      slots: { default: 'action' },
    },
  ];
}

const gridOptions: VxeTableGridOptions<SystemPlusOrgModuleNs.SystemPlusOrg> = {
  columns: useColumns(),
  data: [],
  // loading: false,
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
  treeConfig: {
    // 对于同一级的节点，每次只能展开一个
    accordion: true,
    parentField: 'parentId',
    rowField: 'id',
    childrenField: 'children',
  },
};

export const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

export const formatState = (row: SystemPlusOrgModuleNs.SystemPlusOrg) => {
  return row.state === '1' ? '正常' : '禁用';
};

// 自定义方法
export const onDelete = (row: SystemPlusOrgModuleNs.SystemPlusOrg) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    loadData();
  });
};

export const loadData = () => {
  gridApi.setLoading(true);
  tableTree({})
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
