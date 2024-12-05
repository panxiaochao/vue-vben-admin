<script setup lang="ts">
import { defineEmits, reactive, toRaw } from 'vue';

import { Form } from 'ant-design-vue';

import { save } from '#/api/system/settings/dict';

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
  dictName: undefined,
  dictCode: undefined,
  remark: undefined,
  dictType: '0',
  sort: 0,
  state: '1',
});

const rulesRef = reactive({
  dictName: [{ type: 'string', required: true, message: '请输入字典名称' }],
  dictCode: [{ type: 'string', required: true, message: '请输入字典编码' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

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
    title="新建字典"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item
        label="字典名称"
        name="dictName"
        v-bind="validateInfos.dictName"
      >
        <a-input v-model:value="modelRef.dictName" allow-clear />
      </a-form-item>
      <a-form-item
        label="字典编码"
        name="dictCode"
        v-bind="validateInfos.dictCode"
      >
        <a-input v-model:value="modelRef.dictCode" allow-clear />
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
      <a-form-item label="字典类型" name="dictType">
        <a-radio-group v-model:value="modelRef.dictType">
          <a-radio value="0">字符串型</a-radio>
          <a-radio value="1">数值类型</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="描述" name="remark">
        <a-textarea v-model:value="modelRef.remark" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
