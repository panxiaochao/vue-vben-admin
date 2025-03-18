<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, reactive, ref, toRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { FormOutlined, PullRequestOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteById, page, publishedData } from '#/api/system-plus/settings/dict';

// 自定义组件
import DictionaryItem from './dictionary-item/index.vue';
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

const addForm = ref();
const editForm = ref();
const dictionaryItem = ref();
const publishedLoading = ref(false);

// 字段对象
interface RowType {
  id: string;
  dictName: string;
  dictCode: string;
  remark: string;
  sort: number;
  createTime: string;
  state: string;
}

// 字段定义
const columns = [
  { field: 'dictName', title: '字典名称' },
  { field: 'dictCode', title: '字典编码' },
  { field: 'remark', title: '描述' },
  { field: 'sort', title: '排序' },
  { field: 'createTime', title: '创建时间' },
  { field: 'state', title: '状态', width: 80, slots: { default: 'state' } },
  { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'dictName',
      label: '字典名称：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入字典名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'dictCode',
      label: '字典编码：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入字典编码',
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
  await (bool
    ? gridApi.reload(Object.assign(queryParams, { pageNo: 1 }))
    : gridApi.query(queryParams));
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

// 发布字典
const onPublishedData = () => {
  publishedLoading.value = true;
  publishedData()
    .then(() => {
      message.success('发布成功！');
    })
    .finally(() => {
      publishedLoading.value = false;
    });
};
</script>

<template>
  <Page auto-content-height>
    <AddForm ref="addForm" :width="500" @done="formDone" />
    <EditForm ref="editForm" :width="500" @done="formDone" />
    <DictionaryItem ref="dictionaryItem" :width="1000" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建字典
        </a-button>
        <a-button
          :icon="h(PullRequestOutlined)"
          :loading="publishedLoading"
          class="mr-2"
          type="primary"
          @click="onPublishedData"
        >
          发布字典
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
          @click="dictionaryItem.openModal(row.id)"
        >
          字典配置
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
  </Page>
</template>
