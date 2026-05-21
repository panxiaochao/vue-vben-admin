<script setup lang="ts">
import { defineEmits, reactive, ref, toRaw } from 'vue';

import { saveTableAndColumns } from '#/api/system-plus/development/online-table';
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

// 响应式数据 dataSourceList 存储数据源列表
const dataSourceList = defineModel('dataSourceList', {
  type: Array,
  default: [],
});

const modelRef = reactive({ ...defaultModel });

const { resetFields, validate, validateInfos } = useFormApi(modelRef);

const openModal = () => {
  open.value = true;
  // 初始化下拉
  fieldTable.value.loadJdbcType();
};

// 数据库类型下拉数据变换解析
const handleDataSourceChange = (value: any) => {
  fieldTable.value.loadJdbcType(value);
};

const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    values.columns = fieldTable.value.submitHandler();
    saveTableAndColumns(values).then(() => {
      resetFields();
      open.value = false;
      // 刷新
      $emits('done');
    });
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
        <a-col :span="8">
          <a-form-item
            label="数据源"
            name="dataSourceId"
            v-bind="validateInfos.datasourceId"
          >
            <a-select
              v-model:value="modelRef.datasourceId"
              :options="dataSourceList"
              allow-clear
              placeholder="请选择数据源"
              @change="handleDataSourceChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="表名"
            name="tableName"
            v-bind="validateInfos.tableName"
          >
            <a-input v-model:value="modelRef.tableName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="8">
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
