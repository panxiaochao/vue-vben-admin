<script setup lang="ts">
import type { LanguageType } from '@pxc/codemirror';

import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

// 自定义组件
import { CodeEdit, Themes } from '@pxc/codemirror';
import { Form, message } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { update } from '#/api/system-plus/development/gen-template';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const codeEditRef = ref();

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
  templateName: string | undefined;
  generatorPath: string | undefined;
  templateType: LanguageType;
  templateDesc: string | undefined;
  templateCode: string | undefined;
}

const defaultModel = {
  id: undefined,
  templateName: undefined,
  generatorPath: undefined,
  templateType: 'java' as LanguageType,
  templateDesc: undefined,
  templateCode: '',
};

const modelRef = reactive<FormState>({ ...defaultModel });

const rulesRef = reactive({
  templateName: [{ type: 'string', required: true, message: '请输入模板名称' }],
  generatorPath: [
    { type: 'string', required: true, message: '请输入模板路径' },
  ],
  templateType: [{ type: 'string', required: true, message: '请输入模板类型' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', {
  type: [String, Number],
  default: 800 as number | string,
});

const templateTypeList = defineModel('templateTypeList', {
  type: Array,
  default: [],
});

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
    const values = toRaw(modelRef);
    const { codeValue } = codeEditRef.value;
    if (codeValue) {
      values.templateCode = codeValue;
      update(values).then(() => {
        codeEditRef.value.codeValue = '';
        resetFields();
        open.value = false;
        // 刷新
        $emits('done');
      });
    } else {
      message.error('模版代码不能为空');
    }
  });
};

const handleCancel = () => {
  resetFields();
  open.value = false;
  codeEditRef.value.codeValue = '';
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
    title="新建模版"
    wrap-class-name="full-modal"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-layout>
      <a-layout>
        <a-layout-sider width="350" style="background: #fff">
          <a-form v-bind="formItemLayout">
            <a-form-item
              label="模版名称"
              name="templateName"
              v-bind="validateInfos.templateName"
            >
              <a-input v-model:value="modelRef.templateName" allow-clear />
            </a-form-item>
            <a-form-item
              label="模版路径"
              name="generatorPath"
              v-bind="validateInfos.generatorPath"
            >
              <a-textarea
                :rows="4"
                v-model:value="modelRef.generatorPath"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              label="模版类型"
              name="templateType"
              v-bind="validateInfos.templateType"
            >
              <a-select
                v-model:value="modelRef.templateType"
                :options="templateTypeList"
                allow-clear
                placeholder="请选择模版类型"
              />
            </a-form-item>
            <a-form-item label="模版描述" name="templateDesc">
              <a-textarea
                v-model:value="modelRef.templateDesc"
                :rows="4"
                allow-clear
              />
            </a-form-item>
          </a-form>
        </a-layout-sider>
        <a-layout>
          <a-layout-content>
            <CodeEdit
              ref="codeEditRef"
              :model-value="modelRef.templateCode"
              :language="modelRef.templateType"
              :theme="Themes.dracula"
              :height="650"
            />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </a-modal>
</template>

<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
    height: 100%;
    min-height: calc(100vh - 0px);
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>
