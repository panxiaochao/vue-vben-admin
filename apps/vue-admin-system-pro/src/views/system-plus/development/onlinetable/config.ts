import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref, toRaw } from 'vue';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectDataSourceList } from '#/api/system-plus/development/datasource';
import { queryDsTable } from '#/api/system-plus/development/gen-table';
import { deleteById } from '#/api/system-plus/permission/org';

export namespace SystemPlusOnlineTableModuleNs {
  export interface SystemPlusOnlineTable {
    [key: string]: any;
    databaseId: string | undefined;
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
      fieldName: 'databaseId',
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
    { field: 'catalog', title: '数据库目录' },
    { field: 'schema', title: '数据库模式' },
    { field: 'tableName', title: '表名' },
    { field: 'tableComment', title: '表注释' },
    {
      field: 'action',
      title: '操作',
      width: 200,
      slots: { default: 'action' },
    },
  ];
}

const gridOptions: VxeGridProps<SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable> =
  {
    columns: useColumns(),
    height: 'auto',
    pagerConfig: {
      enabled: false,
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
export const onDelete = (
  row: SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable,
) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    loadData();
  });
};

// 远程获取数据
export function loadData(params?: object) {
  gridApi.setLoading(true);
  queryDsTable(params)
    .then((res) => {
      gridApi.setGridOptions({
        data: res,
      });
    })
    .catch(() => {
      gridApi.setGridOptions({
        data: [],
      });
    })
    .finally(() => {
      gridApi.setLoading(false);
    });
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
  loadData();
};

function onSubmit(values: Record<string, any>) {
  if ((values.databaseId ?? '') === '') {
    message.error('请选择数据源！');
  } else {
    loadData(toRaw(values));
  }
}

function onReset() {
  gridApi.formApi.resetForm();
  gridApi.setGridOptions({ data: [] });
}
