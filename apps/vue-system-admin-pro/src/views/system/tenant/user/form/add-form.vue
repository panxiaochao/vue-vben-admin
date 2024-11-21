<script setup lang="ts">
import { defineEmits, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import dayjs from 'dayjs';

import { selectPackages } from '#/api/system/tenant/package';
import { save, selectModes } from '#/api/system/tenant/user';

defineOptions({
  name: 'AddForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

const packageList = ref([]);
const modeList = ref([]);

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
  tenantId: undefined,
  packageId: undefined,
  contactUserName: undefined,
  contactPhone: undefined,
  companyName: undefined,
  socialCode: undefined,
  companyAddress: undefined,
  companyDomain: undefined,
  mode: undefined,
  expireTime: undefined,
  state: '1',
});

const rulesRef = reactive({
  tenantId: [{ type: 'string', required: true, message: '请输入租户编号' }],
  packageId: [{ type: 'string', required: true, message: '请输入租户套餐' }],
  contactUserName: [
    { type: 'string', required: true, message: '请输入联系人' },
  ],
  contactPhone: [{ type: 'string', required: true, message: '请输入联系电话' }],
  companyName: [{ type: 'string', required: true, message: '请输入企业名称' }],
  socialCode: [{ type: 'string', required: true, message: '请输入信用代码' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const openModal = () => {
  open.value = true;
  // 加载租户套餐数据
  packageList.value = [];
  selectPackages().then((res) => {
    packageList.value = res;
  });
  // 加载租户模式数据
  modeList.value = [];
  selectModes().then((res) => {
    modeList.value = res;
  });
};

const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    if (values.expireTime) {
      Object.assign(values, {
        expireTime: dayjs(values.expireTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
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
    title="新建租户"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="租户编号"
            name="tenantId"
            v-bind="validateInfos.tenantId"
          >
            <a-input
              v-model:value="modelRef.tenantId"
              allow-clear
              placeholder="请填写租户编号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="租户套餐"
            name="packageId"
            v-bind="validateInfos.packageId"
          >
            <a-select
              v-model:value="modelRef.packageId"
              :options="packageList"
              allow-clear
              placeholder="请选择租户套餐"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="联系人"
            name="contactUserName"
            v-bind="validateInfos.contactUserName"
          >
            <a-input v-model:value="modelRef.contactUserName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="联系电话"
            name="contactPhone"
            v-bind="validateInfos.contactPhone"
          >
            <a-input v-model:value="modelRef.contactPhone" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="企业名称"
            name="companyName"
            v-bind="validateInfos.companyName"
          >
            <a-input v-model:value="modelRef.companyName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="信用代码"
            name="socialCode"
            v-bind="validateInfos.socialCode"
          >
            <a-input v-model:value="modelRef.socialCode" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="企业地址" name="companyAddress">
            <a-input v-model:value="modelRef.companyAddress" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="域名" name="companyDomain">
            <a-input v-model:value="modelRef.companyDomain" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="租户模式" name="mode">
            <a-select
              v-model:value="modelRef.mode"
              :options="modeList"
              allow-clear
              placeholder="请选择租户模式"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="过期时间" name="expireTime">
            <a-date-picker
              v-model:value="modelRef.expireTime"
              show-time
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="状态" name="state">
            <a-radio-group v-model:value="modelRef.state">
              <a-radio value="1">正常</a-radio>
              <a-radio value="0">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12" />
      </a-row>
    </a-form>
  </a-modal>
</template>
