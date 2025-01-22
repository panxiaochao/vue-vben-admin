<script setup lang="ts">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { h, reactive, ref, toRaw } from 'vue';

import { FormOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteById, page } from '#/api/system/settings/dict-item';

import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

defineOptions({
  name: 'DictionaryItem',
  inheritAttrs: false,
});

// 自定义组件
const addForm = ref();
const editForm = ref();

// 字段对象
interface RowType {
  id: string;
  dictItemText: string;
  dictItemValue: string;
  remark: string;
  sort: number;
  state: string;
}

// 字段定义
const columns = [
  { field: 'dictItemText', title: '字典名称' },
  { field: 'dictItemValue', title: '字典编码' },
  { field: 'remark', title: '描述' },
  { field: 'sort', title: '排序' },
  { field: 'state', title: '状态', width: 80, slots: { default: 'state' } },
  { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
];

const defaultQueryParams = {
  pageNo: 1,
  pageSize: 5,
  dictId: '',
};

// 查询参数
const queryParams = reactive({
  ...defaultQueryParams,
});

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
  pagerConfig: {
    currentPage: 1,
    pageSize: 5,
    total: 0,
    pageSizes: [5, 10, 20, 30],
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
  gridEvents,
  gridOptions,
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

// 强制刷新
async function refresh(bool: boolean) {
  bool &&
    Object.assign(queryParams, {
      pageNo: 1,
    });
  await loadData();
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

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const openModal = (id: string) => {
  open.value = true;
  queryParams.dictId = id;
  loadData();
};

const handleCancel = () => {
  open.value = false;
  Object.assign(queryParams, defaultQueryParams);
  gridApi.setGridOptions({ data: [] });
};

// 暴露方法
defineExpose({
  openModal,
});
</script>

<template>
  <a-modal
    :body-style="{ padding: '20px' }"
    :footer="null"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="字典项列表"
    @cancel="handleCancel"
  >
    <AddForm ref="addForm" :width="500" @done="formDone" />
    <EditForm ref="editForm" :width="500" @done="formDone" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal(queryParams.dictId)"
        >
          新建字典项
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
