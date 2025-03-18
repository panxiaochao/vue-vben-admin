<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { reactive, toRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { page } from '#/api/system-plus/log/operate';

// 字段对象
interface RowType {
  id: string;
  opTitle: string;
  ip: string;
  address: string;
  method: string;
  browser: string;
  os: string;
  costTime: string;
  createTime: string;
  opUser: string;
}

// 字段定义
const columns = [
  { field: 'opTitle', title: '名称' },
  { field: 'ip', title: 'IP', width: 150 },
  { field: 'address', title: '地址' },
  { field: 'method', title: '类方法', width: 250 },
  { field: 'browser', title: '浏览器' },
  { field: 'os', title: '设备' },
  { field: 'costTime', title: '耗时(ms)', width: 80 },
  { field: 'createTime', title: '访问时间', width: 180 },
  { field: 'opUser', title: '操作人' },
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
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
