<script setup lang="ts">
import { reactive, toRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { page } from '#/api/system/log/login';

// 字段对象
interface RowType {
  id: string;
  loginName: string;
  ip: string;
  address: string;
  browser: string;
  os: string;
  createTime: string;
  remark: string;
  loginType: number;
  state: string;
}

// 字段定义
const columns = [
  { field: 'loginName', title: '登录名' },
  { field: 'ip', title: 'IP' },
  { field: 'address', title: '地址' },
  { field: 'browser', title: '浏览器' },
  { field: 'os', title: '设备' },
  { field: 'createTime', title: '创建时间' },
  { field: 'remark', title: '内容', width: 300 },
  {
    field: 'loginType',
    title: '类型',
    width: 80,
    slots: { default: 'loginType' },
  },
  { field: 'state', title: '状态', width: 80, slots: { default: 'state' } },
];

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
      query: async ({ page }) => {
        Object.assign(queryParams, {
          pageNo: page.currentPage,
          pageSize: page.pageSize,
        });
        return await loadData();
      },
    },
  },
};

// 定义表格
const [Grid] = useVbenVxeGrid({
  gridOptions,
});

// 加载远程数据
async function loadData() {
  return page(toRaw(queryParams));
}

// 格式化数据
const formatLoginType = (row: RowType) => {
  return row.loginType === 1 ? '登录' : '登出';
};

const formatState = (row: RowType) => {
  return row.state === '1' ? '正常' : '禁用';
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #loginType="{ row }">
        <a-tag :color="row.loginType === 1 ? 'green' : 'red'" class="mr-0">
          {{ formatLoginType(row) }}
        </a-tag>
      </template>
      <template #state="{ row }">
        <a-tag :color="row.state === '1' ? 'green' : 'red'" class="mr-0">
          {{ formatState(row) }}
        </a-tag>
      </template>
    </Grid>
  </Page>
</template>
