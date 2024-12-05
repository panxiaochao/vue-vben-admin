<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { update } from '#/api/system/settings/area';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

const confirmLoading = ref<boolean>(false);

const areaLevelList = defineModel('areaLevelList', {
  type: Array,
  default: [],
});
const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

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
  parentId: string | undefined;
  areaName: string | undefined;
  areaCode: string | undefined;
  cityCode: string | undefined;
  areaLevel: number | undefined;
  areaNameEn: string | undefined;
  areaNameEnAbbr: string | undefined;
  parentPath: string | undefined;
  longitude: string | undefined;
  latitude: string | undefined;
}

const defaultModel = {
  id: undefined,
  parentId: undefined,
  areaName: undefined,
  areaCode: undefined,
  cityCode: undefined,
  areaLevel: undefined,
  areaNameEn: undefined,
  areaNameEnAbbr: undefined,
  parentPath: undefined,
  longitude: undefined,
  latitude: undefined,
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

const rulesRef = reactive({
  areaName: [{ type: 'string', required: true, message: '请输入区域名称' }],
  areaCode: [{ type: 'string', required: true, message: '请输入区域编码' }],
  areaLevel: [{ type: 'number', required: true, message: '请输入区域层级' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

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
  updateForm(raw);
};

const handleOk = () => {
  validate().then(() => {
    confirmLoading.value = true;
    setTimeout(() => {
      const values = toRaw(modelRef);
      update(values)
        .then(() => {
          resetFields();
          confirmLoading.value = false;
          open.value = false;
          // 刷新
          $emits('done');
        })
        .finally(() => (confirmLoading.value = false));
    }, 100);
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
    :confirm-loading="confirmLoading"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="编辑区域"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-input v-model:value="modelRef.id" allow-clear class="hidden" />
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="区域名称"
            name="areaName"
            v-bind="validateInfos.areaName"
          >
            <a-input v-model:value="modelRef.areaName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="区域编码"
            name="areaCode"
            v-bind="validateInfos.areaCode"
          >
            <a-input v-model:value="modelRef.areaCode" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="区域层级"
            name="areaLevel"
            v-bind="validateInfos.areaLevel"
          >
            <a-select
              v-model:value="modelRef.areaLevel"
              :options="areaLevelList"
              allow-clear
              placeholder="请选择区域层级"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="行政编码" name="cityCode">
            <a-input v-model:value="modelRef.cityCode" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="英文名称" name="areaNameEn">
            <a-input v-model:value="modelRef.areaNameEn" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="英文简称" name="areaNameEnAbbr">
            <a-input v-model:value="modelRef.areaNameEnAbbr" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="经度" name="longitude">
            <a-input v-model:value="modelRef.longitude" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="维度" name="latitude">
            <a-input v-model:value="modelRef.latitude" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="地区路径" name="parentPath">
            <a-input v-model:value="modelRef.parentPath" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12" />
      </a-row>
    </a-form>
  </a-modal>
</template>
