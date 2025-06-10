<script lang="ts" setup>
import type { SystemPlusOrgModuleNs } from '#/views/system-plus/permission/org/index';

import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteById, tableTree } from '#/api/system-plus/permission/org';
import {
  formatState,
  gridOptions,
} from '#/views/system-plus/permission/org/index';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

const addForm = ref();
const editForm = ref();

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

// 自定义方法
const deleteRow = (row: SystemPlusOrgModuleNs.SystemPlusOrg) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    loadData();
  });
};

const loadData = () => {
  gridApi.setLoading(true);
  tableTree({}).then((res) => {
    gridApi.setGridOptions({ data: res });
    gridApi.setLoading(false);
  });
};

// 表单处理完成做刷新处理
const formDone = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>
<template>
  <Page auto-content-height>
    <AddForm ref="addForm" :width="600" @done="formDone" />
    <EditForm ref="editForm" :width="600" @done="formDone" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建机构
        </a-button>
      </template>
      <template #orgCategoryStr="{ row }">
        <a-tag>
          {{ row.orgCategoryStr }}
        </a-tag>
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
          title="删除本菜单与下级？"
          @confirm="() => deleteRow(row)"
        >
          <a-button class="px-0" danger type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </Grid>
  </Page>
</template>
