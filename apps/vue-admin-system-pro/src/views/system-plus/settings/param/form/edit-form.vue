<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { selectParamTypes, update } from '#/api/system-plus/settings/param';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;
// 参数类型选项
const radioOptions = ref<
  Array<{ disabled?: boolean; label: string; value: string }>
>([]);

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
  paramName: string | undefined;
  paramKey: string | undefined;
  paramValue: string | undefined;
  paramType: string;
  state: string | undefined;
}

const defaultModel = {
  id: undefined,
  paramName: undefined,
  paramKey: undefined,
  paramValue: undefined,
  paramType: '1',
  state: '1',
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

const rulesRef = reactive({
  paramName: [{ type: 'string', required: true, message: '请输入参数名称' }],
  paramKey: [{ type: 'string', required: true, message: '请输入参数编码' }],
  paramValue: [{ type: 'string', required: true, message: '请输入参数值' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

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
  // 获取参数类型选项
  radioOptions.value = [];
  selectParamTypes().then((res) => {
    radioOptions.value = res;
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
    title="编辑参数"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-input v-model:value="modelRef.id" allow-clear class="hidden" />
      <a-form-item
        label="参数名称"
        name="paramName"
        v-bind="validateInfos.paramName"
      >
        <a-input v-model:value="modelRef.paramName" allow-clear />
      </a-form-item>
      <a-form-item
        label="参数键"
        name="paramKey"
        v-bind="validateInfos.paramKey"
      >
        <a-input v-model:value="modelRef.paramKey" allow-clear />
      </a-form-item>
      <a-form-item
        label="参数值"
        name="paramValue"
        v-bind="validateInfos.paramValue"
      >
        <a-input v-model:value="modelRef.paramValue" allow-clear />
      </a-form-item>
      <a-form-item label="状态" name="state">
        <a-radio-group v-model:value="modelRef.state">
          <a-radio value="1">正常</a-radio>
          <a-radio value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="参数类型" name="paramType">
        <a-radio-group
          v-model:value="modelRef.paramType"
          :options="radioOptions"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
