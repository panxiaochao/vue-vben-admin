<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, onMounted, reactive, ref, toRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteById,
  page,
  selectTemplateTypes,
} from '#/api/system-plus/development/gen-template';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

const addForm = ref();
const editForm = ref();
// 表单宽度
const formWidth = ref('100%');

// 模版类型下拉
const templateTypeList = ref([]);

// 字段对象
interface RowType {
  id: string;
  templateName: string;
  generatorPath: string;
  templateDesc: string;
  templateType: string;
  createTime: string;
}

// 字段定义
const columns = [
  { field: 'templateName', title: '模版名称' },
  { field: 'generatorPath', title: '模版路径' },
  { field: 'templateDesc', title: '模版描述' },
  {
    field: 'templateType',
    title: '模版类型',
    slots: { default: 'templateType' },
    width: 80,
  },
  { field: 'createTime', title: '创建时间', width: 180 },
  { field: 'action', title: '操作', width: 170, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'templateName',
      label: '模版名称：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入模版名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'templateType',
      label: '模版类型：',
      componentProps: () => {
        return {
          options: templateTypeList,
          placeholder: '请输入模版类型',
          fieldNames: { label: 'label', value: 'label' },
        };
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

onMounted(() => {
  // 加载数据库类型
  selectTemplateTypes().then((res) => {
    templateTypeList.value = res;
  });
});
</script>

<template>
  <Page auto-content-height>
    <AddForm
      ref="addForm"
      :width="formWidth"
      @done="formDone"
      :template-type-list="templateTypeList"
    />
    <EditForm
      ref="editForm"
      :width="formWidth"
      @done="formDone"
      :template-type-list="templateTypeList"
    />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建模版
        </a-button>
      </template>
      <template #templateType="{ row }">
        <a-tag color="blue" class="mr-0">
          {{ row.templateType }}
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
