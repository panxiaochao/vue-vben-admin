import type { EChartsOption } from 'echarts';

import type { Ref } from 'vue';
import { computed, nextTick, ref, unref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import {
  tryOnUnmounted,
  useDebounceFn,
  useResizeObserver,
  useTimeoutFn,
  useWindowSize,
} from '@vueuse/core';

import echarts from './echarts';

type EchartsThemeType = 'dark' | 'light' | null;

function useEcharts(chartRef: Ref<HTMLDivElement>) {
  console.log('---useECharts---初始化加载---');
  let chartInstance: echarts.ECharts | null = null;
  const cacheOptions = ref({}) as Ref<EChartsOption>;

  const { isDark } = usePreferences();
  const { height, width } = useWindowSize();
  const resizeHandler: () => void = useDebounceFn(resize, 200);

  const getOptions = computed((): EChartsOption => {
    if (!isDark.value) {
      return cacheOptions.value as EChartsOption;
    }

    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption;
  });

  const initCharts = (t?: EchartsThemeType) => {
    const el = unref(chartRef);
    if (!el || !unref(el)) {
      return;
    }

    chartInstance = echarts.init(el, t || isDark.value ? 'dark' : null);
    return chartInstance;
  };

  const setOptions = (options: EChartsOption, clear = true) => {
    cacheOptions.value = options;
    if (unref(chartRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions));
      }, 30);
      return;
    }
    const currentOptions = {
      ...options,
      ...getOptions.value,
    };
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          const instance = initCharts();
          if (!instance) return;
        }
        clear && chartInstance?.clear();

        chartInstance?.setOption(currentOptions);
      }, 30);
    });
  };

  function resize() {
    chartInstance?.resize();
  }

  useResizeObserver(chartRef as never, resizeHandler);

  watch([width, height], () => {
    resizeHandler?.();
  });

  watch(isDark, () => {
    if (chartInstance) {
      chartInstance.dispose();
      initCharts();
      setOptions(cacheOptions.value);
      resize();
    }
  });

  tryOnUnmounted(() => {
    // 销毁实例，释放资源
    if (!chartInstance) return;
    chartInstance.dispose();
    chartInstance = null;
  });

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts();
    }
    return chartInstance;
  }

  return {
    getInstance,
    resize,
    setOptions,
  };
}

export { useEcharts };
