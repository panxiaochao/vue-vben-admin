<script setup lang="ts">
import { defineEmits, reactive, toRaw } from 'vue';

import { Form } from 'ant-design-vue';

import { save } from '#/api/system/database/fieldtype';

defineOptions({
  name: 'AddForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const modelRef = reactive({
  dbType: undefined,
  columnType: undefined,
  packageName: undefined,
});

const rulesRef = reactive({
  dbType: [{ type: 'string', required: true, message: '请输入数据库类型' }],
  columnType: [
    { type: 'string', required: true, message: '请输入数据库字段类型' },
  ],
  packageName: [
    { type: 'string', required: true, message: '请输入JAVA映射类型' },
  ],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const dbTypeList = defineModel('dbTypeList', { type: Array, default: [] });

const javaTypeList = defineModel('javaTypeList', { type: Array, default: [] });

const openModal = () => {
  open.value = true;
};

const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    save(values).then(() => {
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
    title="新建岗位"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item
        label="数据库类型"
        name="dbType"
        v-bind="validateInfos.dbType"
      >
        <a-select
          v-model:value="modelRef.dbType"
          :options="dbTypeList"
          allow-clear
          placeholder="请选择数据库类型"
        />
      </a-form-item>
      <a-form-item
        label="字段类型"
        name="columnType"
        v-bind="validateInfos.columnType"
      >
        <a-input v-model:value="modelRef.columnType" allow-clear />
      </a-form-item>
      <a-form-item
        label="JAVA映射"
        name="packageName"
        v-bind="validateInfos.packageName"
      >
        <a-select
          v-model:value="modelRef.packageName"
          :options="javaTypeList"
          allow-clear
          placeholder="请选择JAVA映射类型"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
