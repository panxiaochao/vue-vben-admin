<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { update } from '#/api/system-plus/development/gen-group';
import { selectTemplateList } from '#/api/system-plus/development/gen-template';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

const templateList = ref([]);

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
  groupName: string | undefined;
  groupDesc: string | undefined;
  templateIds: string[] | undefined;
}

const defaultModel = {
  id: undefined,
  groupName: undefined,
  groupDesc: undefined,
  templateIds: [],
};

const modelRef = reactive<FormState>({ ...defaultModel });

const rulesRef = reactive({
  groupName: [{ type: 'string', required: true, message: '请输入分组名称' }],
  templateIds: [{ type: 'array', required: true, message: '请输入模版类型' }],
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
  // 加载模版类型
  templateList.value = [];
  selectTemplateList().then((res) => {
    templateList.value = res;
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
    title="编辑分组"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item
        label="分组名称"
        name="groupName"
        v-bind="validateInfos.groupName"
      >
        <a-input disabled v-model:value="modelRef.groupName" allow-clear />
      </a-form-item>
      <a-form-item
        label="模本类型"
        name="templateIds"
        v-bind="validateInfos.templateIds"
      >
        <a-select
          v-model:value="modelRef.templateIds"
          :options="templateList"
          allow-clear
          mode="multiple"
          placeholder="请选择模版类型"
        />
      </a-form-item>
      <a-form-item label="分组描述" name="groupDesc">
        <a-textarea v-model:value="modelRef.groupDesc" :rows="4" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
