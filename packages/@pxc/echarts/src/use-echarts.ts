import type { Ref } from 'vue';

import type { ECOption } from './config';

import { computed, nextTick, ref, unref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import {
  tryOnUnmounted,
  useDebounceFn,
  useResizeObserver,
  useTimeoutFn,
  useWindowSize,
} from '@vueuse/core';
// 可以根据需要选用只用到的渲染器
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

import echarts from './config';

type EchartsThemeType = 'dark' | 'light' | null;

type EchartsRenderType = 'CanvasRenderer' | 'SVGRenderer';

function useEcharts(
  chartRef: Ref<HTMLDivElement | null>,
  render?: EchartsRenderType,
) {
  console.log('useECharts初始化加载');
  // 渲染模式
  if (render) {
    echarts.use(render === 'SVGRenderer' ? SVGRenderer : CanvasRenderer);
  }
  let chartInstance: echarts.ECharts | null = null;
  const cacheOptions = ref({}) as Ref<ECOption>;

  const { isDark } = usePreferences();
  const { height, width } = useWindowSize();
  const resizeHandler: () => void = useDebounceFn(resize, 200);

  const getOptions = computed((): ECOption => {
    if (!isDark.value) {
      return cacheOptions.value as ECOption;
    }

    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as ECOption;
  });

  // 初始化图表实例的函数
  const initCharts = (t?: EchartsThemeType) => {
    const el = unref(chartRef);
    if (!el || !unref(el)) {
      return;
    }

    chartInstance = echarts.init(el, t || isDark.value ? 'dark' : null);
    return chartInstance;
  };

  const setOptions = (options: ECOption, clear = true) => {
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
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn',
      },
    });
  }

  // 监测元素节点，如果尺寸发生变化就触发
  useResizeObserver(chartRef as never, resizeHandler);

  watch([width, height], () => {
    resizeHandler?.();
  });

  watch(isDark, () => {
    if (chartInstance) {
      chartInstance.dispose();
      initCharts();
      setOptions(cacheOptions.value);
      resizeHandler();
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
    echarts,
    getInstance,
    resize,
    setOptions,
  };
}

export { useEcharts };
