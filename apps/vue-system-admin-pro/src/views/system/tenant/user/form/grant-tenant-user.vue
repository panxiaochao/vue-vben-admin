<script setup lang="ts">
import { h, nextTick, reactive, ref, toRaw } from 'vue';

import { type VbenFormProps } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';
import { Button, message } from 'ant-design-vue';
import { pick } from 'lodash-es';

import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { selectPageByTenantId } from '#/api/system/permission/user';
import { deleteTenantUser } from '#/api/system/tenant/tenant-user';

// 自定义组件
import UserTable from './user-table.vue';

defineOptions({
  name: 'GrantTenantUser',
  inheritAttrs: false,
});

const userTable = ref();

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

// 字段对象
interface FormState {
  tenantId: string;
}

const defaultModel = {
  tenantId: '',
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

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
  { field: 'createTime', width: 180, title: '创建时间' },
  { field: 'action', title: '操作', width: 80, slots: { default: 'action' } },
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
  height: 'auto',
  pagerConfig: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 15, 20, 50, 100],
  },
};

// 监听事件：分页
const gridEvents: VxeGridListeners<RowType> = {
  pageChange: ({ currentPage, pageSize }) => {
    Object.assign(queryParams, {
      pageNo: currentPage,
      pageSize,
    });
    loadData();
  },
};

// 定义表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
  gridEvents,
});

// 加载远程数据
async function loadData() {
  return selectPageByTenantId(toRaw(queryParams)).then((res) => {
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
    Object.assign(queryParams, {
      pageNo: 1,
    });
  await loadData();
}

// 格式化数据
const formatSex = (row: RowType) => {
  return row.sex === '1' ? '男' : '女';
};

// 自定义方法
const deleteRow = (row: RowType) => {
  deleteTenantUser({ tenantId: modelRef.tenantId, userId: row.id }).then(() => {
    message.success('删除成功');
    // reload
    refresh(true);
  });
};

// 表单处理完成做刷新处理
const formDone = () => {
  refresh(true);
};

// 赋值
const updateForm = (raw: FormState) => {
  const rawValues = toRaw(raw || {});
  if (rawValues) {
    nextTick(() => {
      const fieldNames = Object.keys(defaultModel) ?? [];
      Object.assign(modelRef, pick(rawValues, fieldNames));
    });
  }
};

const openModal = (raw: FormState) => {
  open.value = true;
  Object.assign(queryParams, {
    tenantId: raw.tenantId,
  });
  updateForm(raw);
  loadData();
};

const onClose = () => {
  open.value = false;
  gridApi.setGridOptions({ data: [] });
};

// 暴露方法
defineExpose({
  openModal,
});
</script>

<template>
  <a-drawer
    :body-style="{ backgroundColor: 'hsl(var(216 20.11% 95.47%))' }"
    :mask-closable="false"
    :open="open"
    :width="width"
    placement="right"
    title="授权用户"
    @close="onClose"
  >
    <UserTable ref="userTable" :width="900" @done="formDone" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="userTable.openModal(modelRef)"
        >
          选择用户
        </a-button>
      </template>
      <template #sex="{ row }">
        <span>{{ formatSex(row) }}</span>
      </template>
      <template #action="{ row }">
        <a-popconfirm
          placement="top"
          title="确定要删除吗?"
          @confirm="() => deleteRow(row)"
        >
          <Button class="px-0" danger type="link">删除</Button>
        </a-popconfirm>
      </template>
    </Grid>
  </a-drawer>
</template>

<style scoped>
.bg-background-deep {
  background-color: hsl(0deg 0% 100%);
}
</style>
