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
  selectDbTypes,
  selectJavaTypes,
} from '#/api/system/database/fieldtype';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

const addForm = ref();
const editForm = ref();
// 数据库类型下拉
const dbTypeList = ref([]);
// JavaType下拉
const javaTypeList = ref([]);

// 字段对象
interface RowType {
  id: string;
  dbTypeStr: string;
  columnType: string;
  javaType: string;
  packageName: number;
}

// 字段定义
const columns = [
  { field: 'dbTypeStr', title: '数据库类型' },
  { field: 'columnType', title: '数据库字段类型' },
  { field: 'javaType', title: 'JAVA映射类型' },
  { field: 'packageName', title: 'JAVA包名' },
  { field: 'action', title: '操作', width: 170, slots: { default: 'action' } },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'dbType',
      label: '数据库类型：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入数据库类型',
      },
    },
    {
      component: 'Input',
      fieldName: 'columnType',
      label: '字段类型：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入数据库字段类型',
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

// 下拉初始化
const selectInit = () => {
  // 加载数据库类型数据
  selectDbTypes().then((res) => {
    dbTypeList.value = res;
  });
  // 加载JavaType数据
  selectJavaTypes().then((res) => {
    javaTypeList.value = res;
  });
};

onMounted(() => {
  selectInit();
});
</script>

<template>
  <Page auto-content-height>
    <AddForm
      ref="addForm"
      :db-type-list="dbTypeList"
      :java-type-list="javaTypeList"
      :width="500"
      @done="formDone"
    />
    <EditForm
      ref="editForm"
      :db-type-list="dbTypeList"
      :java-type-list="javaTypeList"
      :width="500"
      @done="formDone"
    />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建字段映射
        </a-button>
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
