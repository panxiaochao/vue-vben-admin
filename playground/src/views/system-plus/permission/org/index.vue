<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';

import {
  collapseAll,
  expandAll,
  formatStatus,
  formDone,
  Grid,
  loadData,
  onDelete,
} from '#/views/system-plus/permission/org/config';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

const addForm = ref();
const editForm = ref();

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
        <a-button class="mr-2" @click="expandAll"> 展开所有 </a-button>
        <a-button class="mr-2" @click="collapseAll"> 折叠所有 </a-button>
      </template>
      <template #orgCategoryStr="{ row }">
        <a-tag>
          {{ row.orgCategoryStr }}
        </a-tag>
      </template>
      <template #status="{ row }">
        <a-tag :color="row.status === '1' ? 'success' : 'red'" class="mr-0">
          {{ formatStatus(row) }}
        </a-tag>
      </template>
      <template #action="{ row }">
        <a-button class="!px-0" type="link" @click="addForm.openModal(row)">
          添加下级
        </a-button>
        <a-divider type="vertical" />
        <a-button class="!px-0" type="link" @click="editForm.openModal(row)">
          编辑
        </a-button>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="topLeft"
          title="删除本菜单与下级？"
          @confirm="() => onDelete(row)"
        >
          <a-button class="!px-0" danger type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </Grid>
  </Page>
</template>
