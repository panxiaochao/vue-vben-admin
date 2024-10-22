<script setup lang="ts">
import { Page, type VbenFormProps } from '@vben/common-ui';

import { DownOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Popconfirm,
  Tag,
} from 'ant-design-vue';

import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { deleteById, page } from '#/api';

// 字段对象
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

// 字段定义
const columns = [
  { field: 'realName', title: '用户姓名', with: 150 },
  { field: 'sex', title: '性别', slots: { default: 'sex' } },
  { field: 'mobile', title: '手机号码' },
  { field: 'email', title: '邮箱' },
  { field: 'updateTime', title: '更新时间' },
  { field: 'loginTime', title: '登录时间' },
  { field: 'state', title: '状态', width: 100, slots: { default: 'state' } },
  { field: 'action', title: '操作', width: 170, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'realName',
      label: '用户姓名',
      componentProps: {
        allowClear: true,
        placeholder: '请输入用户姓名',
      },
    },
    {
      component: 'Input',
      fieldName: 'mobile',
      label: '手机号码',
      componentProps: {
        allowClear: true,
        placeholder: '请输入手机号码',
      },
    },
  ],
  showCollapseButton: false,
};

const gridOptions: VxeGridProps<RowType> = {
  columns,
  // data: [],
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
        const params = Object.assign(
          {},
          {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          },
        );
        return await loadData(params);
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
async function loadData(params: {}) {
  return page(params);
}

// 定义表格
const [Grid] = useVbenVxeGrid({ gridEvents, gridOptions, formOptions });

// 格式化数据
const formatSex = (row: RowVO) => {
  return row.sex === '1' ? '男' : '女';
};

const formatState = (row: RowVO) => {
  return row.state === '1' ? '正常' : '禁用';
};

// 自定方法
const deleteRow = (row: RowVO) => {
  deleteById(row.id)
    .then(() => message.success('删除成功'))
    .catch(() => message.error('删除失败'));
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #sex="{ row }">
        <span>{{ formatSex(row) }}</span>
      </template>
      <template #state="{ row }">
        <Tag :color="row.state === '1' ? 'success' : 'red'" class="mr-0">
          {{ formatState(row) }}
        </Tag>
      </template>
      <template #action="{ row }">
        <Button class="px-0" type="link">编辑</Button>
        <Divider type="vertical" />
        <Popconfirm
          placement="top"
          title="确定要删除吗?"
          @confirm="() => deleteRow(row)"
        >
          <Button class="px-0" danger type="link">删除</Button>
        </Popconfirm>
        <Divider type="vertical" />
        <Dropdown :arrow="{ pointAtCenter: true }" placement="bottomRight">
          <Button class="px-0" type="link"> 更多<DownOutlined /> </Button>
          <template #overlay>
            <Menu>
              <MenuItem><a>密码管理</a></MenuItem>
              <MenuItem><a>授权角色</a></MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
  </Page>
</template>
