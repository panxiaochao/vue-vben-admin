<script setup lang="ts">
import type { SystemPlusOnlineTableModuleNs } from '#/views/system-plus/development/onlinetable/config';

import { defineEmits, reactive, ref, toRaw } from 'vue';

import {
  defaultModel,
  formItemLayout,
  useFormApi,
} from '#/views/system-plus/development/onlinetable/form/form-config';

// 自定义组件
import FieldTable from './field-table.vue';

defineOptions({
  name: 'AddForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

// 引用组件
const fieldTable = ref();

// 响应式数据 open 控制模态框的显示和隐藏
const open = defineModel('open', { type: Boolean, default: false });

// 响应式数据 width 控制模态框的宽度
const width = defineModel('width', { type: Number, default: 800 });

const modelRef = reactive({ ...defaultModel });

const { resetFields, validate, validateInfos } = useFormApi(modelRef);

const openModal = (
  raw?: SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable,
) => {
  open.value = true;
};

const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    // save(values).then(() => {
    //   resetFields();
    //   open.value = false;
    //   // 刷新
    //   $emits('done');
    // });
    fieldTable.value.submitHandler();
  });
};

const handleCancel = () => {
  resetFields();
  open.value = false;
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
    title="新建表"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="表名"
            name="tableName"
            v-bind="validateInfos.tableName"
          >
            <a-input v-model:value="modelRef.tableName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="表注释"
            name="tableComment"
            v-bind="validateInfos.tableComment"
          >
            <a-input v-model:value="modelRef.tableComment" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <FieldTable ref="fieldTable" />
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
