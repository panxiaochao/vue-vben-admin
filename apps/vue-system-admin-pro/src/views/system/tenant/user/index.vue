<script setup lang="ts">
import { h, reactive, ref, toRaw } from 'vue';

import { Page, type VbenFormProps } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';
import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { deleteById, page } from '#/api/system/tenant/user';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';
import GrantTenantUser from './form/grant-tenant-user.vue';

const addForm = ref();
const editForm = ref();
const grantTenantUser = ref();

// 字段对象
interface RowType {
  id: string;
  tenantId: string;
  contactUserName: string;
  contactPhone: string;
  packageName: string;
  modeStr: string;
  expireTime: string;
  createTime: string;
  state: string;
}

// 字段定义
const columns = [
  { field: 'tenantId', title: '租户编号' },
  { field: 'contactUserName', title: '联系人' },
  { field: 'contactPhone', title: '联系电话' },
  { field: 'packageName', title: '租户套餐' },
  { field: 'modeStr', title: '租户模式' },
  { field: 'expireTime', title: '过期时间' },
  { field: 'createTime', title: '创建时间' },
  { field: 'state', title: '状态', width: 100, slots: { default: 'state' } },
  { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'tenantId',
      label: '租户编号：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入租户编号',
      },
    },
    {
      component: 'Input',
      fieldName: 'contactUserName',
      label: '联系人：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入联系人',
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
  await (bool ? gridApi.reload(queryParams) : gridApi.query(queryParams));
}

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

// 表单处理完成做刷新处理
const formDone = () => {
  refresh(true);
};
</script>

<template>
  <Page auto-content-height>
    <AddForm ref="addForm" :width="900" @done="formDone" />
    <EditForm ref="editForm" :width="900" @done="formDone" />
    <GrantTenantUser ref="grantTenantUser" :width="900" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建租户
        </a-button>
      </template>
      <template #state="{ row }">
        <a-tag :color="row.state === '1' ? 'success' : 'red'" class="mr-0">
          {{ formatState(row) }}
        </a-tag>
      </template>
      <template #action="{ row }">
        <a-button class="px-0" type="link" @click="editForm.openModal(row)">
          编辑
        </a-button>
        <a-divider type="vertical" />
        <a-button
          class="px-0"
          type="link"
          @click="grantTenantUser.openModal(row)"
        >
          授权用户
        </a-button>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="right"
          title="确定要删除吗?"
          @confirm="() => deleteRow(row)"
        >
          <Button class="px-0" danger type="link">删除</Button>
        </a-popconfirm>
      </template>
    </Grid>
  </Page>
</template>
