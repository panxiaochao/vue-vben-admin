<script setup lang="ts">
import type { StepProps } from 'ant-design-vue';

import { nextTick, reactive, ref } from 'vue';

// 自定义组件
import BasicInfo from './basic-info.vue';
import FieldInfo from './field-info.vue';
import ResultInfo from './result-info.vue';

defineOptions({
  name: 'GenIndex',
  inheritAttrs: false,
});

const basicInfo = ref();
const fieldInfo = ref();
const resultInfo = ref();

// 当前步骤
const current = ref<number>(0);

// 选项卡内容
const defaultItem: StepProps[] = [
  {
    title: '基本信息',
  },
  {
    title: '字段信息',
  },
  {
    title: '结果',
  },
];

const item = reactive<StepProps[]>(defaultItem);

// 跳转步骤
const go = (activeSteps: number) => {
  current.value = activeSteps;
};

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const openModal = (tableId: string) => {
  open.value = true;
  // 等待子组件加载完成
  nextTick(() => {
    basicInfo.value.updateForm(tableId);
  });
};

const onClose = () => {
  open.value = false;
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
    title="编辑"
    @close="onClose"
  >
    <a-card>
      <a-steps
        class="stepsCls"
        :current="current"
        label-placement="vertical"
        :items="item"
      />
    </a-card>
    <a-card class="mt-5">
      <div class="content">
        <BasicInfo ref="basicInfo" v-if="current === 0" />
        <FieldInfo v-if="current === 1" />
        <ResultInfo v-if="current === 2" />

        <div style="text-align: center">
          <a-button type="primary" @click="go(1)" v-if="current === 0">
            下一步
          </a-button>
          <a-button @click="go(0)" v-if="current === 1 || 2"> 上一步 </a-button>
          <a-button @click="go(2)" v-if="current === 1"> 保存并预览 </a-button>
          <a-button @click="go(2)" v-if="current === 1"> 保存并生成 </a-button>
        </div>
      </div>
    </a-card>
  </a-drawer>
</template>

<style scoped>
.stepsCls {
  max-width: 800px;
  margin: 0 auto;
}
</style>
