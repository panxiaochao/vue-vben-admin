<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, onMounted, reactive, ref, toRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteById,
  page,
  selectDbSources,
  testConn,
} from '#/api/system-plus/development/datasource';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

const addForm = ref();
const editForm = ref();

// 数据库类型下拉
const dbTypeList = ref([]);

// 字段对象
interface RowType {
  id: string;
  dbName: string;
  dbCode: string;
  dbType: string;
  dbUsername: number;
  testConn: string;
  testConnTime: string;
  createTime: string;
}

// 字段定义
const columns = [
  { field: 'dbName', title: '数据库名称' },
  { field: 'dbCode', title: '数据源编码' },
  { field: 'dbType', title: '数据库类型' },
  { field: 'dbUsername', title: '用户名' },
  { field: 'testConn', title: '连接状态', slots: { default: 'testConn' } },
  { field: 'testConnTime', title: '最近连接时间' },
  { field: 'createTime', title: '创建时间' },
  { field: 'action', title: '操作', width: 190, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'dbName',
      label: '数据库名称：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入数据库名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'dbType',
      label: '数据库类型：',
      componentProps: () => {
        return {
          options: dbTypeList,
          placeholder: '请输入数据库类型',
          fieldNames: { label: 'label', value: 'label' },
        };
      },
    },
  ],
  showCollapseButton: false,
};

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
  // loading: false,
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

// 加载远程数据
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

const formatTestConn = (row: RowType) => {
  return row.testConn === '1' ? '成功' : '失败';
};

// 自定义方法
const deleteRow = (row: RowType) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    // reload
    refresh(true);
  });
};

// 测试链接
const testConnSource = (row: RowType) => {
  testConn(row).then((res) => {
    if (res.testConn === '1') {
      message.success('连接成功');
    } else {
      message.error('连接失败');
    }
    row.testConnTime = res.testConnTime;
    row.testConn = res.testConn;
    editForm.value.updateConnState(row);
  });
};

// 表单处理完成做刷新处理
const formDone = () => {
  refresh(true);
};

onMounted(() => {
  // 加载数据库类型
  selectDbSources().then((res) => {
    dbTypeList.value = res;
  });
});
</script>

<template>
  <Page auto-content-height>
    <AddForm ref="addForm" @done="formDone" :db-type-list="dbTypeList" />
    <EditForm ref="editForm" @done="formDone" :db-type-list="dbTypeList" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建数据源
        </a-button>
      </template>
      <template #testConn="{ row }">
        <a-tag :color="row.testConn === '1' ? 'success' : 'red'" class="mr-0">
          {{ formatTestConn(row) }}
        </a-tag>
      </template>
      <template #action="{ row }">
        <a-button class="px-0" type="link" @click="editForm.openModal(row)">
          编辑
        </a-button>
        <a-divider type="vertical" />
        <a-button class="px-0" type="link" @click="testConnSource(row)">
          测试连接
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
