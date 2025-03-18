<script setup lang="ts">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { h, reactive, ref, toRaw } from 'vue';

import { FormOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteById, page } from '#/api/system-plus/permission/user-auth';

// 自定义组件
import PasswordAddForm from './password-add-form.vue';
import PasswordEditForm from './password-edit-form.vue';

defineOptions({
  name: 'PasswordTable',
  inheritAttrs: false,
});

const passwordAddForm = ref();
const passwordEditForm = ref();

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

// 字段对象
interface FormState {
  userId: string;
  pageNo: number;
  pageSize: number;
}

const defaultModel = {
  userId: '',
  pageNo: 1,
  pageSize: 5,
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

// 字段对象
interface RowType {
  id: string;
  userId: string;
  identityTypeStr: string;
  identifier: string;
  verified: string;
  expireTime: string;
}

// 字段定义
const columns = [
  { field: 'identityTypeStr', title: '登录类型' },
  { field: 'identifier', title: '登录账号' },
  { field: 'verified', title: '是否验证', slots: { default: 'verified' } },
  { field: 'expireTime', width: 180, title: '失效时间' },
  { field: 'action', width: 120, title: '操作', slots: { default: 'action' } },
];

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
  height: 'auto',
  pagerConfig: {
    currentPage: 1,
    pageSize: 5,
    total: 0,
    pageSizes: [10, 15, 20, 50, 100],
  },
};

// 监听事件：分页
const gridEvents: VxeGridListeners<RowType> = {
  pageChange: ({ currentPage, pageSize }) => {
    Object.assign(modelRef, {
      pageNo: currentPage,
      pageSize,
    });
    loadData();
  },
};

// 定义表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  gridEvents,
});

// 加载数据
function loadData() {
  fetchData(toRaw(modelRef));
}

// 远程获取数据
function fetchData(params: object) {
  page(params).then((res) => {
    gridApi.setGridOptions({
      data: res.list,
      pagerConfig: {
        currentPage: res.pagination.pageNo,
        pageSize: res.pagination.pageSize,
        total: res.pagination.total,
      },
    });
  });
}

// 强制刷新
async function refresh(bool: boolean) {
  bool &&
    Object.assign(modelRef, {
      pageNo: 1,
    });
  loadData();
}

// 格式化数据
const formatVerified = (row: RowType) => {
  return row.verified === '1' ? '验证' : '未验证';
};

// 自定义方法
const deleteRow = (row: RowType) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    // reload
    refresh(true);
  });
};

const handleCancel = () => {
  open.value = false;
  gridApi.setGridOptions({
    data: [],
    pagerConfig: {
      currentPage: 1,
      pageSize: 5,
      total: 0,
    },
  });
};
// 表单处理完成做刷新处理
const formDone = () => {
  refresh(true);
};

const openModal = (raw: RowType) => {
  open.value = true;
  Object.assign(modelRef, { userId: raw.id });
  loadData();
};

// 暴露方法
defineExpose({
  openModal,
});
</script>

<template>
  <a-modal
    :body-style="{ padding: '20px', height: '380px' }"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="密码管理"
    @cancel="handleCancel"
    :footer="null"
  >
    <PasswordAddForm ref="passwordAddForm" :width="900" @done="formDone" />
    <PasswordEditForm ref="passwordEditForm" :width="900" @done="formDone" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="passwordAddForm.openModal(modelRef.userId)"
        >
          新建登录凭证
        </a-button>
      </template>
      <template #verified="{ row }">
        <a-tag :color="row.verified === '1' ? 'success' : 'red'" class="mr-0">
          <span>{{ formatVerified(row) }}</span>
        </a-tag>
      </template>
      <template #action="{ row }">
        <a-button
          class="px-0"
          type="link"
          @click="passwordEditForm.openModal(row)"
        >
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
  </a-modal>
</template>

<style scoped></style>
