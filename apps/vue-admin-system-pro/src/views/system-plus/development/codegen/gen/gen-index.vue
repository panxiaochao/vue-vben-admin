<script setup lang="ts">
import type { StepProps } from 'ant-design-vue';

import { reactive, ref } from 'vue';

import { downloadFileFromBlob } from '@vben/utils';

import { message } from 'ant-design-vue';

import { download, generatorCode } from '#/api/system-plus/development/gen';
import { parseContentDispositionForFileName } from '#/utils/download-helper';

// 自定义组件
import BasicInfo from './basic-info.vue';
import CodePreview from './code-preview.vue';
import FieldInfo from './field-info.vue';

defineOptions({
  name: 'GenIndex',
  inheritAttrs: false,
});

const basicInfo = ref();
const fieldInfo = ref();
const codePreview = ref();

// 当前步骤
const current = ref<number>(0);

// 表单id 表ID
const currentTableId = ref<string>('');

// 预览model宽度
const modelWidth = ref('100%');

// 按钮加载状态
const btnLoading = ref(false);

// 选项卡内容
const defaultItem: StepProps[] = [
  {
    title: '基本信息',
  },
  {
    title: '字段信息',
  },
];

const item = reactive<StepProps[]>(defaultItem);

// 跳转步骤
const go = async (activeSteps: number) => {
  if (activeSteps === 1) {
    const isValid = await basicInfo.value.handleOk();
    if (!isValid) {
      return;
    }
  }
  current.value = activeSteps;
};

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const openModal = (tableId: string) => {
  console.log(tableId);
  open.value = true;
  currentTableId.value = tableId;
};

const onClose = () => {
  open.value = false;
  current.value = 0;
};

// 预览
const preview = async () => {
  await fieldInfo.value.submitHandler();
  codePreview.value.openModal();
};

// 下载ZIP包
const generatorHandler = async () => {
  btnLoading.value = true;
  message
    .loading('正在生成中...', 1.5)
    .then(() => {
      generatorCodeApi();
    })
    .then(() => {
      btnLoading.value = false;
    });
};

const downBlobFile = () => {
  download({ tableIds: currentTableId.value }).then((res) => {
    const { headers } = res;
    // 尝试不同的大小写组合
    const contentDisposition =
      headers['content-disposition'] ||
      headers['Content-Disposition'] ||
      headers['CONTENT-DISPOSITION'];
    const fileName = parseContentDispositionForFileName(
      contentDisposition,
      'GeneratorCode.zip',
    );
    // 通过Blob下载文件
    downloadFileFromBlob({ fileName, source: res.data });
  });
};

const generatorCodeApi = () => {
  generatorCode({ tableIds: currentTableId.value }).then(() => {
    message.success('导出到自定义路径成功');
  });
};

// 暴露方法
defineExpose({
  openModal,
});
</script>

<template>
  <a-drawer
    :mask-closable="false"
    :open="open"
    :width="width"
    placement="right"
    title="生成代码"
    @close="onClose"
  >
    <CodePreview
      ref="codePreview"
      :width="modelWidth"
      :table-id="currentTableId"
    />
    <a-steps
      class="stepsCls"
      :current="current"
      label-placement="vertical"
      :items="item"
    />

    <div class="content">
      <BasicInfo
        ref="basicInfo"
        :table-id="currentTableId"
        v-if="current === 0"
      />
      <FieldInfo
        ref="fieldInfo"
        :table-id="currentTableId"
        v-if="current === 1"
      />

      <div style="text-align: center" class="pb-5">
        <a-space>
          <a-button type="primary" @click="go(1)" v-if="current === 0">
            下一步
          </a-button>
          <a-button type="primary" @click="go(0)" v-if="current === 1">
            上一步
          </a-button>
          <a-button @click="preview" :loading="btnLoading" v-if="current === 1">
            保存并预览
          </a-button>
          <a-button
            @click="generatorHandler"
            :loading="btnLoading"
            v-if="current === 1"
          >
            保存并生成
          </a-button>
        </a-space>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
.stepsCls {
  max-width: 800px;
  margin: 0 auto;
}
</style>
