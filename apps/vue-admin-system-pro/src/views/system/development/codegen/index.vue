<script setup lang="ts">
import { onMounted, reactive, toRaw } from 'vue';

import { Page, type VbenFormProps } from '@vben/common-ui';

import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { queryDsTablePage } from '#/api/system/development/codegen';

const defaultQueryParams = {
  pageNo: 1,
  pageSize: 10,
};

// 查询参数
const queryParams = reactive({
  ...defaultQueryParams,
});

// 字段对象
interface RowType {
  schema: string;
  catalog: string;
  tableName: string;
  tableComment: string;
  tableType: string;
}

// 字段定义
const columns = [
  { field: 'schema', title: '数据库名' },
  { field: 'catalog', title: '目录' },
  { field: 'tableName', title: '表名' },
  { field: 'tableComment', title: '表注释' },
  { field: 'tableType', title: '表类型' },
  { field: 'action', title: '操作', width: 80, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  // 提交函数
  handleSubmit: onSubmit,
  // 重置函数
  handleReset: onReset,
  schema: [
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

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
  height: 'auto',
  pagerConfig: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 15, 20, 50, 100],
  },
};

// 监听事件：分页
const gridEvents: VxeGridListeners<RowType> = {
  pageChange: ({ currentPage, pageSize }) => {
    Object.assign(queryParams, {
      pageNo: currentPage,
      pageSize,
    });
    loadData();
  },
};

// 定义表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
  gridEvents,
});

// 加载数据
function loadData() {
  fetchData(toRaw(queryParams));
}

// 远程获取数据
function fetchData(params: object) {
  queryDsTablePage(params).then((res) => {
    gridApi.setGridOptions({
      data: res.list,
      pagerConfig: {
        currentPage: res.pagination.pageNo,
        pageSize: res.pagination.pageSize,
        total: res.pagination.total,
      },
    });
  });
}

// 强制刷新
async function refresh(bool: boolean) {
  bool &&
    Object.assign(queryParams, {
      pageNo: 1,
    });
  loadData();
}

function onSubmit(values: Record<string, any>) {
  Object.assign(queryParams, values);
  fetchData(queryParams);
}

function onReset() {
  gridApi.formApi.resetForm();
  refresh(true);
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <a-button class="px-0" type="link"> 编辑 </a-button>
      </template>
    </Grid>
  </Page>
</template>
