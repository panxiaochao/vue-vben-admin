<script lang="ts">
import type { ECOption } from '@pxc/framework/echarts';

import type { PropType, Ref } from 'vue';

import { defineComponent, reactive, ref, watchEffect } from 'vue';

import { useEcharts } from '@pxc/framework/echarts';
import { cloneDeep } from 'lodash-es';

export default defineComponent({
  name: 'Pie',
  inheritAttrs: false,
  props: {
    chartData: {
      type: Array,
      default: () => [],
    },
    option: {
      type: Object,
      default: () => ({}),
    },
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '500px',
    },
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions, getInstance } = useEcharts(
      chartRef as Ref<HTMLDivElement>,
    );
    const option: ECOption = reactive({
      legend: {
        top: 'bottom',
      },
      series: [
        {
          animationEasing: 'exponentialInOut',
          animationType: 'scale',
          center: ['50%', '50%'],
          data: [],
          name: '命令统计',
          radius: '60%',
          type: 'pie',
        },
      ],
      tooltip: {
        trigger: 'item',
      },
    });

    watchEffect(() => {
      props.chartData && initCharts();
    });

    function initCharts() {
      if (props.option) {
        Object.assign(option, cloneDeep(props.option));
      }
      option.series[0].data = props.chartData;
      setOptions(option);
    }

    return { chartRef, getInstance };
  },
});
</script>

<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
