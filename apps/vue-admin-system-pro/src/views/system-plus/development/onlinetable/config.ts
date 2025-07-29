import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { reactive, ref, toRaw } from 'vue';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectDataSourceList } from '#/api/system-plus/development/datasource';
import { deleteById, page } from '#/api/system-plus/development/online-table';

export namespace SystemPlusOnlineTableModuleNs {
  export interface SystemPlusOnlineTable {
    [key: string]: any;
    datasourceId: string | undefined;
    tableName: string | undefined;
    catalog: string | undefined;
    schema: string | undefined;
    tableComment: string | undefined;
  }
}

export const dataSourceList = ref([]);

// 搜索表单定义
const formOptions: VbenFormProps = {
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    labelClass: 'w-auto',
    wrapperClass: 'pr-3',
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 重置函数
  handleReset: onReset,
  schema: [
    {
      component: 'Select',
      fieldName: 'datasourceId',
      label: '数据源：',
      componentProps: () => {
        return {
          options: dataSourceList,
          placeholder: '请输入数据源',
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'tableName',
      label: '表名：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表名',
      },
    },
  ],
  showCollapseButton: false,
};

/**
 * 字段定义，获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 */
function useColumns(): VxeGridProps<SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable>['columns'] {
  return [
    { field: 'dbName', title: '数据源' },
    { field: 'dbType', title: '数据库类型', slots: { default: 'dbType' } },
    { field: 'tableName', title: '表名' },
    { field: 'tableComment', title: '表注释' },
    { field: 'createTime', title: '创建时间', width: 180 },
    {
      field: 'action',
      title: '操作',
      width: 200,
      slots: { default: 'action' },
    },
  ];
}

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const gridOptions: VxeGridProps<SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable> =
  {
    columns: useColumns(),
    height: 'auto',
    pagerConfig: {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 15, 20, 50, 100],
    },
    proxyConfig: {
      response: {
        result: 'list',
        total: 'pagination.total',
      },
      ajax: {
        query: async ({ page }, formValues) => {
          Object.assign(queryParams, {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return await loadData();
        },
      },
    },
  };

export const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

export const formatState = (
  row: SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable,
) => {
  return row.state === '1' ? '正常' : '禁用';
};

// 自定义方法
export const deleteRow = (
  row: SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable,
) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    refresh(true);
  });
};

// 远程获取数据
export async function loadData() {
  gridApi.setLoading(true);
  return page(toRaw(queryParams)).finally(() => {
    gridApi.setLoading(false);
  });
}

// 强制刷新
async function refresh(bool: boolean) {
  // reload: 强制刷新到第一页 query: 刷新当前页
  await (bool
    ? gridApi.reload(Object.assign(queryParams, { pageNo: 1 }))
    : gridApi.query(queryParams));
}

// 初始化数据源数据
export function loadDataSourceList() {
  dataSourceList.value = [];
  // 加载数据源管理下拉
  selectDataSourceList().then((res) => {
    dataSourceList.value = res;
  });
}

// 表单处理完成做刷新处理
export const formDone = () => {
  refresh(true);
};

function onSubmit(values: Record<string, any>) {
  Object.assign(queryParams, values);
  refresh(true);
}

function onReset() {
  gridApi.formApi.resetForm();
  refresh(true);
}
