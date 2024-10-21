<script setup lang="ts">
import { Page } from '@vben/common-ui';

import {
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  Popconfirm,
  Tag,
} from 'ant-design-vue';

import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { page } from '#/api';

interface RowType {
  id: string;
  realName: string;
  sex: string;
  mobile: string;
  email: string;
  updateTime: string;
  loginTime: string;
  state: string;
}

const columns = [
  { field: 'realName', title: '用户姓名' },
  { field: 'sex', title: '性别', slots: { default: 'sex' } },
  { field: 'mobile', title: '手机号码' },
  { field: 'email', title: '邮箱' },
  { field: 'updateTime', title: '更新时间' },
  { field: 'loginTime', title: '登录时间' },
  { field: 'state', title: '状态', slots: { default: 'state' } },
  { field: 'action', title: '操作', width: 170, slots: { default: 'action' } },
];

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
  loading: false,
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
      query: async () => {
        return await loadData();
      },
    },
  },
};

// 分页变化监听
const gridEvents: VxeGridListeners<RowType> = {
  pageChange: ({ currentPage, pageSize }) => {
    gridOptions.pagerConfig.currentPage = currentPage;
    gridOptions.pagerConfig.pageSize = pageSize;
  },
};

// 加载远程数据
async function loadData() {
  const { pageSize, currentPage } = gridOptions.pagerConfig;
  const params = Object.assign(
    {},
    {
      pageNo: currentPage,
      pageSize,
    },
  );
  return page(params);
}

// 定义表格
const [Grid] = useVbenVxeGrid({ gridEvents, gridOptions });

// 格式化数据
const formatSex = (row: RowVO) => {
  return row.sex === '1' ? '男' : '女';
};

const formatState = (row: RowVO) => {
  return row.state === '1' ? '正常' : '禁用';
};

// 自定方法
const deleteRow = (row: RowVO) => {
  // console.log(row);
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #sex="{ row }">
        <span>{{ formatSex(row) }}</span>
      </template>
      <template #state="{ row }">
        <Tag :color="row.state === '1' ? 'success' : 'red'">
          {{ formatState(row) }}
        </Tag>
      </template>
      <template #action="{ row }">
        <Button type="link">编辑</Button>
        <Divider type="vertical" />
        <Popconfirm
          placement="top"
          title="确定要删除吗?"
          @confirm="() => deleteRow(row)"
        >
          <Button danger type="link">删除</Button>
        </Popconfirm>
        <Divider type="vertical" />
        <Dropdown>
          <a @click.prevent> 更多 </a>
          <template #overlay>
            <Menu>
              <MenuItem><a>密码管理</a></MenuItem>
              <MenuItem><a>授权角色</a></MenuItem>
              <MenuItem />
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.ant-tag {
  margin-right: 0;
}
.custom-ant-button {
  padding: 4px 0 !important;
}
</style>
