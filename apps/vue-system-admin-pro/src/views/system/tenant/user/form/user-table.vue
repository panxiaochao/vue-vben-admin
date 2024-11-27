<script setup lang="ts">
import { nextTick, reactive, toRaw } from 'vue';

import { type VbenFormProps } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import { map, pick } from 'lodash-es';

import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { page } from '#/api/system/permission/user';
import { saveTenantUsers } from '#/api/system/tenant/tenant-user';

defineOptions({
  name: 'UserTable',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

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
  loginTime: string;
  state: string;
}

// 字段定义
const columns = [
  { type: 'checkbox', width: 60 },
  { field: 'realName', title: '用户姓名' },
  { field: 'nickName', title: '用户昵称' },
  { field: 'sex', title: '性别', slots: { default: 'sex' } },
  { field: 'mobile', title: '手机号码' },
  { field: 'createTime', width: 180, title: '创建时间' },
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
  pageSize: 5,
});

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
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
  return page(toRaw(queryParams)).then((res) => {
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

// 格式化数据
const formatSex = (row: RowType) => {
  return row.sex === '1' ? '男' : '女';
};

const handleOk = () => {
  if (gridApi.grid?.getCheckboxRecords().length > 0) {
    const postBody = {
      tenantId: modelRef.tenantId,
      userId: map(gridApi.grid?.getCheckboxRecords(), 'id').join(','),
    };
    saveTenantUsers(postBody).then(() => {
      open.value = false;
      // 刷新
      $emits('done');
    });
  } else {
    message.error('请选择用户!');
  }
};

const handleCancel = () => {
  open.value = false;
  gridApi.setGridOptions({ data: [] });
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
  updateForm(raw);
  loadData();
};

// 暴露方法
defineExpose({
  openModal,
});
</script>

<template>
  <a-modal
    :body-style="{ padding: '20px' }"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="选择用户"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <Grid>
      <template #sex="{ row }">
        <span>{{ formatSex(row) }}</span>
      </template>
    </Grid>
  </a-modal>
</template>

<style scoped>
.bg-background-deep {
  background-color: hsl(0deg 0% 100%);
}
</style>
