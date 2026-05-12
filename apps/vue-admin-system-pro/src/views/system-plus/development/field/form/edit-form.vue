<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { selectDbSources } from '#/api/system-plus/development/datasource';
import { update } from '#/api/system-plus/development/fieldtype';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

// 标签下拉列表
const tagsList = ref([]);

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
  dbType: string | undefined;
  columnType: string | undefined;
  packageName: string | undefined;
  tags: string[];
}

const defaultModel = {
  id: undefined,
  dbType: undefined,
  columnType: undefined,
  packageName: undefined,
  tags: [],
};

const modelRef = reactive<FormState>({ ...defaultModel });

const rulesRef = reactive({
  columnType: [
    { type: 'string', required: true, message: '请输入数据库字段类型' },
  ],
  packageName: [
    { type: 'string', required: true, message: '请输入JAVA映射类型' },
  ],
  tags: [{ required: true, message: '请输入数据库标签' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const javaTypeList = defineModel('javaTypeList', { type: Array, default: [] });

// 赋值
const updateForm = (raw: FormState) => {
  const rawValues = toRaw(raw || {});
  if (rawValues) {
    nextTick(() => {
      const fieldNames = Object.keys(defaultModel) ?? [];
      Object.assign(modelRef, pick(rawValues, fieldNames));
    });
  }
};

const openModal = (raw: FormState) => {
  open.value = true;
  // 加载数据库类型
  tagsList.value = [];
  selectDbSources().then((res) => {
    tagsList.value = res;
  });
  updateForm(raw);
};

const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    update(values).then(() => {
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
    title="编辑字段类型"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-input v-model:value="modelRef.id" allow-clear class="!hidden" />
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
      <a-form-item label="数据库标签" name="tags" v-bind="validateInfos.tags">
        <a-select
          v-model:value="modelRef.tags"
          :options="tagsList"
          allow-clear
          mode="multiple"
          placeholder="请选择数据库标签"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
