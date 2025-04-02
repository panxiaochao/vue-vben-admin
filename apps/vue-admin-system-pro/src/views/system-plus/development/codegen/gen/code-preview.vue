<script setup lang="ts">
import type { LanguageType } from '@pxc/codemirror';

import { ref } from 'vue';

import { CodeEdit } from '@pxc/codemirror';

import { preview } from '#/api/system-plus/development/gen';

// 自定义组件

defineOptions({
  name: 'CodePreview',
  inheritAttrs: false,
});

const codeEditRef = ref();

const activeKey = ref('');

const previewData = ref<
  {
    codeType: LanguageType;
    content: string;
    fileName: string;
    id: string;
  }[]
>([]);

const tableId = defineModel('tableId', { type: String, default: '' });

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', {
  type: [String, Number],
  default: 800 as number | string,
});

const openModal = () => {
  open.value = true;
  preview(tableId.value).then((res) => {
    previewData.value = res;
    if (res.length > 0) {
      activeKey.value = res[0]?.id;
    }
  });
};

const handleCancel = () => {
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
    title="预览"
    wrap-class-name="full-modal"
    @cancel="handleCancel"
  >
    <a-layout>
      <a-layout>
        <a-layout-sider width="20%" style="background: #fff">
          tree
        </a-layout-sider>
        <a-layout>
          <a-layout-content style="background: #fff">
            <a-tabs v-model:active-key="activeKey">
              <a-tab-pane
                v-for="item in previewData"
                :key="item.id"
                :tab="item.fileName"
              >
                <CodeEdit
                  ref="codeEditRef"
                  :model-value="item.content"
                  :language="item.codeType"
                  :height="650"
                />
              </a-tab-pane>
            </a-tabs>
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
