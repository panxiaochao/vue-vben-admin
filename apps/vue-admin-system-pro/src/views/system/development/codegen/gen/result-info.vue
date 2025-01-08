<script setup lang="ts">
defineOptions({
  name: 'ResultInfo',
  inheritAttrs: false,
});
</script>

<template>
  <a-result status="success" title="Successfully">
    <template #extra>
      <a-button key="console" type="primary">查看详情</a-button>
    </template>
  </a-result>
</template>

<style scoped></style>
