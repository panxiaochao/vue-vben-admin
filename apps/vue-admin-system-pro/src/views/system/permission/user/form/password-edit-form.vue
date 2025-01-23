<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { pick } from 'lodash-es';

import { selectIdentityTypes, update } from '#/api/system/permission/user-auth';

defineOptions({
  name: 'PasswordEditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

const identityTypeList = ref([]);

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
  userId: string | undefined;
  identityType: string | undefined;
  identifier: string | undefined;
  credential: string | undefined;
  verified: string | undefined;
  expireTime: Dayjs | undefined;
}

const defaultModel = reactive({
  id: undefined,
  userId: undefined,
  identityType: undefined,
  identifier: undefined,
  credential: undefined,
  verified: '1',
  expireTime: undefined,
});

const modelRef = reactive<FormState>({
  ...defaultModel,
});

const rulesRef = reactive({
  identityType: [{ type: 'string', required: true, message: '请输入登录类型' }],
  identifier: [{ type: 'string', required: true, message: '请输入登录账号' }],
  credential: [{ type: 'string', required: true, message: '请输入登录密码' }],
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
      if (modelRef.expireTime) {
        modelRef.expireTime = dayjs(modelRef.expireTime, 'YYYY-MM-DD HH:mm:ss');
      }
    });
  }
};

const openModal = (raw: FormState) => {
  open.value = true;
  // 加载登录类型数据
  identityTypeList.value = [];
  selectIdentityTypes().then((res) => {
    identityTypeList.value = res;
  });
  updateForm(raw);
};

const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    if (values.expireTime) {
      Object.assign(values, {
        expireTime: dayjs(values.expireTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
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
    title="编辑登录凭证"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item
        label="登录类型"
        name="identityType"
        v-bind="validateInfos.identityType"
      >
        <a-select
          allow-clear
          placeholder="请选择登录类型"
          v-model:value="modelRef.identityType"
          :options="identityTypeList"
        />
      </a-form-item>
      <a-form-item
        label="登录账号"
        name="identifier"
        v-bind="validateInfos.identifier"
      >
        <a-input allow-clear v-model:value="modelRef.identifier" disabled />
      </a-form-item>
      <a-form-item
        label="登录密码"
        name="credential"
        v-bind="validateInfos.credential"
      >
        <a-input-password allow-clear v-model:value="modelRef.credential" />
      </a-form-item>
      <a-form-item label="是否验证" name="verified">
        <a-radio-group v-model:value="modelRef.verified">
          <a-radio value="1">验证</a-radio>
          <a-radio value="0">未验证</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="失效时间" name="expireTime">
        <a-date-picker
          show-time
          v-model:value="modelRef.expireTime"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
