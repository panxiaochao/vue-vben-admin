<script setup lang="ts">
import { reactive, toRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { removeToken, tokenPage } from '#/api/system/settings/online';

// 字段对象
interface RowType {
  userName: string;
  ip: string;
  loginTime: string;
  expireAtStr: string;
  accessToken: string;
}

// 字段定义
const columns = [
  { field: 'userName', title: '用户账号' },
  { field: 'ip', title: '登录IP' },
  { field: 'loginTime', title: '登录时间' },
  { field: 'expireAtStr', title: '过期时间' },
  { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
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
});

// 加载远程数据
async function loadData() {
  return tokenPage(toRaw(queryParams));
}

// 强制刷新
async function refresh(bool: boolean) {
  // reload: 强制刷新到第一页 query: 刷新当前页
  await (bool ? gridApi.reload(queryParams) : gridApi.query(queryParams));
}

// 自定义方法
const logout = (row: RowType) => {
  removeToken(row.accessToken).then(() => {
    message.success('强退成功');
    // reload
    refresh(true);
  });
};
</script>

<template>
  <Page auto-content-height title="在线会话">
    <Grid>
      <template #action="{ row }">
        <a-popconfirm
          placement="top"
          title="确定要强退吗?"
          @confirm="() => logout(row)"
        >
          <a-button class="px-0" danger type="link">强退</a-button>
        </a-popconfirm>
      </template>
    </Grid>
  </Page>
</template>
