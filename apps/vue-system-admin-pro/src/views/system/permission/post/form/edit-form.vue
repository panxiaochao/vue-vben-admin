<script setup lang="ts">
import { defineEmits, nextTick, reactive, toRaw } from 'vue';

import { objectPick } from '@vueuse/core';
import { Form } from 'ant-design-vue';

import { update } from '#/api/system/permission/post';

defineOptions({
  name: 'EditForm',
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
  id: undefined,
  postName: undefined,
  postCode: undefined,
  remark: undefined,
  sort: 0,
  state: '1',
});

const rulesRef = reactive({
  postName: [{ type: 'string', required: true, message: '请输入岗位名称' }],
  postCode: [{ type: 'string', required: true, message: '请输入岗位编码' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const openModal = (raw) => {
  open.value = true;
  // 赋值
  const rawValues = toRaw(raw || {});
  nextTick(() => {
    const fieldNames = Object.keys(modelRef) ?? [];
    const filteredFields = objectPick(rawValues, fieldNames);
    Object.assign(modelRef, filteredFields);
  });
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
    title="新建岗位"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-input v-model:value="modelRef.id" allow-clear class="hidden" />
      <a-form-item
        label="岗位名称"
        name="postName"
        v-bind="validateInfos.postName"
      >
        <a-input v-model:value="modelRef.postName" allow-clear />
      </a-form-item>
      <a-form-item
        label="岗位编码"
        name="postCode"
        v-bind="validateInfos.postCode"
      >
        <a-input v-model:value="modelRef.postCode" allow-clear />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number
          v-model:value="modelRef.sort"
          :max="1000"
          :min="0"
          class="w-full"
        />
      </a-form-item>
      <a-form-item label="状态" name="state">
        <a-radio-group v-model:value="modelRef.state">
          <a-radio value="1">正常</a-radio>
          <a-radio value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="描述" name="remark">
        <a-textarea v-model:value="modelRef.remark" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
