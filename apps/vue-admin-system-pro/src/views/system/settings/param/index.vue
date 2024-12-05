<script setup lang="ts">
import { h, reactive, ref, toRaw } from 'vue';

import { Page, type VbenFormProps } from '@vben/common-ui';

import { FormOutlined, PullRequestOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { deleteById, page, publishedData } from '#/api/system/settings/param';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

const addForm = ref();
const editForm = ref();
const publishedLoading = ref(false);

// 字段对象
interface RowType {
  id: string;
  paramName: string;
  paramKey: string;
  remark: string;
  sort: number;
  createTime: string;
  state: string;
}

// 字段定义
const columns = [
  { field: 'paramName', title: '参数名称' },
  { field: 'paramKey', title: '参数键' },
  { field: 'paramValue', title: '参数值' },
  { field: 'paramTypeStr', title: '参数类型' },
  { field: 'createTime', title: '创建时间', width: 180 },
  { field: 'state', title: '状态', width: 80, slots: { default: 'state' } },
  { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'paramName',
      label: '参数名称：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入参数名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'paramKey',
      label: '参数键：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入参数键',
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

// 发布参数
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
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建参数
        </a-button>
        <a-button
          :icon="h(PullRequestOutlined)"
          :loading="publishedLoading"
          class="mr-2"
          type="primary"
          @click="onPublishedData"
        >
          发布参数
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
  </Page>
</template>
