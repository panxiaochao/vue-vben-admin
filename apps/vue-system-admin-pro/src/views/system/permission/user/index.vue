<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue';

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
import { rolesByUserId } from '#/api/system/permission/user-role';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';
import GrantRole from './form/grant-role.vue';

const addForm = ref();
const editForm = ref();
const grantRole = ref();

const userRoleIds = ref([]);

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
  { field: 'realName', title: '用户姓名' },
  { field: 'nickName', title: '用户昵称' },
  { field: 'sex', title: '性别', slots: { default: 'sex' } },
  { field: 'mobile', title: '手机号码' },
  { field: 'email', title: '邮箱' },
  { field: 'createTime', title: '创建时间' },
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
      label: '用户姓名：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入用户姓名',
      },
    },
    {
      component: 'Input',
      fieldName: 'mobile',
      label: '手机号码：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入手机号码',
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

// 监听事件：分页
const gridEvents: VxeGridListeners<RowType> = {
  pageChange: ({ currentPage, pageSize }) => {
    gridOptions.pagerConfig.currentPage = currentPage;
    gridOptions.pagerConfig.pageSize = pageSize;
  },
};

// 定义表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridEvents,
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
  await (bool ? gridApi.reload(queryParams) : gridApi.query(queryParams));
}

// 格式化数据
const formatSex = (row: RowType) => {
  return row.sex === '1' ? '男' : '女';
};

const formatState = (row: RowType) => {
  return row.state === '1' ? '正常' : '禁用';
};

// 自定义方法
const deleteRow = (row: RowType) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    // reload
    refresh(true);
  });
};

// 选择角色
const selectRoles = (row: RowType) => {
  rolesByUserId({
    userId: row.id,
  }).then((res) => {
    userRoleIds.value = res;
    grantRole.value.openModal(row);
  });
};

// 表单处理完成做刷新处理
const formDone = () => {
  refresh(true);
};
</script>

<template>
  <Page auto-content-height>
    <AddForm ref="addForm" :width="900" @done="formDone" />
    <EditForm ref="editForm" :width="900" @done="formDone" />
    <GrantRole ref="grantRole" :user-role-ids="userRoleIds" :width="500" />
    <Grid>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary" @click="addForm.openModal()">
          新建用户
        </Button>
      </template>
      <template #sex="{ row }">
        <span>{{ formatSex(row) }}</span>
      </template>
      <template #state="{ row }">
        <Tag :color="row.state === '1' ? 'success' : 'red'" class="mr-0">
          {{ formatState(row) }}
        </Tag>
      </template>
      <template #action="{ row }">
        <Button class="px-0" type="link" @click="editForm.openModal(row)">
          编辑
        </Button>
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
          <Button class="px-0" type="link">
            更多
            <DownOutlined />
          </Button>
          <template #overlay>
            <Menu>
              <MenuItem>
                <a>密码管理</a>
              </MenuItem>
              <MenuItem>
                <a @click="selectRoles(row)">授权角色</a>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
  </Page>
</template>
