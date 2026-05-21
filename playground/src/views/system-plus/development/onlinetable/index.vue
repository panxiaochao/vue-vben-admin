<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';

import {
  dataSourceList,
  deleteRow,
  formDone,
  Grid,
  loadData,
  loadDataSourceList,
} from '#/views/system-plus/development/onlinetable/config';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

// 引用组件
const addForm = ref();
const editForm = ref();

onMounted(() => {
  loadData();
  loadDataSourceList();
});
</script>
<template>
  <Page auto-content-height>
    <AddForm
      ref="addForm"
      :width="1300"
      @done="formDone"
      :data-source-list="dataSourceList"
    />
    <EditForm
      ref="editForm"
      :width="600"
      @done="formDone"
      :data-source-list="dataSourceList"
    />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建表
        </a-button>
      </template>
      <template #dbType="{ row }">
        <a-tag v-if="row.dbType !== ''" color="blue">
          {{ row.dbType }}
        </a-tag>
      </template>
      <template #action="{ row }">
        <a-button class="!px-0" type="link" @click="editForm.openModal(row)">
          查看
        </a-button>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="top"
          title="确定要删除吗?"
          @confirm="() => deleteRow(row)"
        >
          <a-button class="!px-0" danger type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </Grid>
  </Page>
</template>
