<script setup lang="ts">
import { nextTick, reactive } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { get } from '#/api/system/development/gen-table';

defineOptions({
  name: 'BasicInfo',
  inheritAttrs: false,
});

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

// 字段对象
interface FormState {
  id: string | undefined;
  tableName: string | undefined;
  className: string | undefined;
  tableComment: string | undefined;
  author: string | undefined;
  email: string | undefined;
  packageName: string | undefined;
  version: string | undefined;
  style: string | undefined;
  generatorType: string | undefined;
  backendPath: string | undefined;
  moduleName: string | undefined;
  functionName: string | undefined;
  formLayout: string | undefined;
  datasourceId: string | undefined;
}

const defaultModel = {
  id: undefined,
  tableName: undefined,
  className: undefined,
  tableComment: undefined,
  author: undefined,
  email: undefined,
  packageName: undefined,
  version: undefined,
  style: undefined,
  generatorType: undefined,
  backendPath: undefined,
  moduleName: undefined,
  functionName: undefined,
  formLayout: undefined,
  datasourceId: undefined,
};

const modelRef = reactive<FormState>({ ...defaultModel });

const rulesRef = reactive({
  tableName: [{ type: 'string', required: true, message: '请输入表名' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

// 赋值
const updateForm = (tableId: string) => {
  console.log(tableId);
  get(tableId).then((res) => {
    nextTick(() => {
      const fieldNames = Object.keys(defaultModel) ?? [];
      Object.assign(modelRef, pick(res, fieldNames));
    });
  });
};

// 暴露方法
defineExpose({
  updateForm,
});
</script>

<template>
  <a-form v-bind="formItemLayout" class="formCls">
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
          label="注释"
          name="tableComment"
          v-bind="validateInfos.tableComment"
        >
          <a-input v-model:value="modelRef.tableComment" allow-clear />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="类名"
          name="className"
          v-bind="validateInfos.className"
        >
          <a-input v-model:value="modelRef.className" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="作者" name="author" v-bind="validateInfos.author">
          <a-input v-model:value="modelRef.author" allow-clear />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="邮箱" name="email" v-bind="validateInfos.email">
          <a-input v-model:value="modelRef.email" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="版本号" name="version">
          <a-input v-model:value="modelRef.version" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="项目包名"
          name="packageName"
          v-bind="validateInfos.packageName"
        >
          <a-input v-model:value="modelRef.packageName" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="模块名" name="moduleName">
          <a-input v-model:value="modelRef.moduleName" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="功能名" name="functionName">
          <a-input
            v-model:value="modelRef.functionName"
            :rows="4"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="代码风格"
          name="dbUsername"
          v-bind="validateInfos.style"
        >
          <a-input v-model:value="modelRef.style" allow-clear />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="表单布局"
          name="formLayout"
          v-bind="validateInfos.formLayout"
        >
          <a-input v-model:value="modelRef.formLayout" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="生成方式" name="generatorType">
          <a-input v-model:value="modelRef.generatorType" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          label="后端路径"
          name="backendPath"
          v-bind="validateInfos.backendPath"
        >
          <a-input v-model:value="modelRef.backendPath" allow-clear />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style scoped>
.formCls {
  max-width: 800px;
  margin: 0 auto;
}
</style>
