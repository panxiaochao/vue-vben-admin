<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, onMounted, reactive, ref, toRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { ImportOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectDataSourceList } from '#/api/system-plus/development/datasource';
import { deleteById, page } from '#/api/system-plus/development/gen-table';

// 自定义组件
import ImportTable from './form/import-table.vue';
import GenIndex from './gen/gen-index.vue';

const importTable = ref();
const genIndex = ref();

const dataSourceList = ref([]);

// 定义变量内容
// const router = useRouter();

const defaultQueryParams = {
  pageNo: 1,
  pageSize: 10,
  dbName: '',
};

// 查询参数
const queryParams = reactive({
  ...defaultQueryParams,
});

// 字段对象
interface RowType {
  id: string;
  tableName: string;
  tableComment: string;
  className: string;
  generatorType: string;
  createTime: string;
}

// 字段定义
const columns = [
  { field: 'tableName', title: '表名' },
  { field: 'tableComment', title: '表注释' },
  { field: 'className', title: '类名' },
  {
    field: 'generatorType',
    title: '生成方式',
    slots: { default: 'generatorType' },
  },
  { field: 'createTime', title: '创建时间', width: 180 },
  { field: 'action', title: '操作', width: 180, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
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

// 定义表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

// 加载数据
async function loadData() {
  return page(toRaw(queryParams));
}

// 强制刷新
async function refresh(bool: boolean) {
  // reload: 强制刷新到第一页 query: 刷新当前页
  await (bool
    ? gridApi.reload(Object.assign(queryParams, { pageNo: 1 }))
    : gridApi.query(queryParams));
}

// 自定义方法
const deleteRow = (row: RowType) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    // reload
    refresh(true);
  });
};

// const openGenTab = (row: RowType) => {
//   router.push({
//     path: '/system/development/codegen/gen',
//     query: {
//       tableName: row.tableName,
//       dsName: queryParams?.dbName,
//     },
//   });
// };

const formatGeneratorType = (row: RowType) => {
  return row.generatorType === '1' ? '自定义' : 'ZIP压缩';
};

// 表单处理完成做刷新处理
const formDone = () => {
  refresh(true);
};

onMounted(() => {
  // 加载数据源管理下拉
  selectDataSourceList().then((res) => {
    dataSourceList.value = res;
  });
});
</script>

<template>
  <Page auto-content-height>
    <ImportTable
      ref="importTable"
      @done="formDone"
      :data-source-list="dataSourceList"
    />
    <GenIndex ref="genIndex" :width="1200" @done="formDone" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(ImportOutlined)"
          class="mr-2"
          type="primary"
          @click="importTable.openModal()"
        >
          导入
        </a-button>
      </template>
      <template #generatorType="{ row }">
        <a-tag color="blue" class="mr-0">
          {{ formatGeneratorType(row) }}
        </a-tag>
      </template>
      <template #action="{ row }">
        <a-button class="px-0" type="link" @click="genIndex.openModal(row.id)">
          编辑
        </a-button>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="top"
          title="确定要删除吗?"
          @confirm="() => deleteRow(row)"
        >
          <a-button class="px-0" danger type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </Grid>
  </Page>
</template>
