<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';

import {
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
    <AddForm ref="addForm" :width="1300" @done="formDone" />
    <EditForm ref="editForm" :width="600" @done="formDone" />
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
      <template #action="{ row }">
        <a-button class="px-0" type="link" @click="editForm.openModal(row)">
          查看
        </a-button>
      </template>
    </Grid>
  </Page>
</template>
