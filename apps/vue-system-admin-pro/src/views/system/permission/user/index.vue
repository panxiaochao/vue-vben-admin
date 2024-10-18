<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { getExampleTableApi } from '#/api';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const columns = [
  { title: '序号', type: 'seq', width: 50 },
  { field: 'category', title: 'Category' },
  { field: 'color', title: 'Color' },
  { field: 'productName', title: 'Product Name' },
  { field: 'price', title: 'Price' },
  { field: 'releaseDate', formatter: 'formatDateTime', title: 'DateTime' },
];

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
  emptyText: '没有更多数据了！',
  loading: false,
  height: 'auto',
  pagerConfig: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 15, 20, 50, 100],
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
