// 引入图表，图表后缀都为 Chart
import {
  BarChart,
  GaugeChart,
  LineChart,
  MapChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts';

// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  AriaComponent,
  CalendarComponent,
  DatasetComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  ParallelComponent,
  PolarComponent,
  RadarComponent,
  TimelineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
} from 'echarts/components';

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 可以根据需要选用只用到的渲染器
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  PieChart,
  RadarChart,
  ScatterChart,
  MapChart,
  PictorialBarChart,
  GaugeChart,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  RadarComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  SVGRenderer,
  LegendComponent,
  ToolboxComponent,
]);

export default echarts;
