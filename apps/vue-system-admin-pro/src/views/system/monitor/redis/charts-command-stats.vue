<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import {
  EchartsUI,
  type EchartsUIType,
  useEcharts,
} from '@vben/plugins/echarts';

defineOptions({
  name: 'ChartsCommandStats',
  inheritAttrs: false,
});

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const pieData = defineModel('pieData', { type: Array, default: [] });

onMounted(() => {
  renderEcharts({
    legend: {
      top: 'bottom',
    },
    series: [
      {
        animationDelay() {
          return Math.random() * 400;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        center: ['50%', '50%'],
        data: [],
        name: '命令统计',
        radius: '60%',
        roseType: 'radius',
        type: 'pie',
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" height="500px" />
</template>
