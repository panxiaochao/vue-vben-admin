<script setup lang="ts">
import { defineEmits, reactive, ref, toRaw } from 'vue';

// 自定义组件
import { CodeEdit } from '@pxc/codemirror';
import { Form } from 'ant-design-vue';

import { save } from '#/api/system-plus/development/fieldtype';

defineOptions({
  name: 'AddForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const codeEdit = ref();

const useForm = Form.useForm;

const modelRef = reactive({
  templateName: undefined,
  generatorPath: undefined,
  templateDesc: undefined,
  templateCode: undefined,
});

const rulesRef = reactive({
  templateName: [{ type: 'string', required: true, message: '请输入模板名称' }],
  generatorPath: [
    { type: 'string', required: true, message: '请输入模板路径' },
  ],
});

const { resetFields, validate } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', {
  type: [String, Number],
  default: 800 as number | string,
});

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
    title="新建模版"
    wrap-class-name="full-modal"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-layout>
      <a-layout>
        <a-layout-sider width="400" style="background: #fff">
          sider
        </a-layout-sider>
        <a-layout>
          <a-layout-content>
            <CodeEdit ref="codeEdit" :model-value="modelRef.templateCode" />
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
