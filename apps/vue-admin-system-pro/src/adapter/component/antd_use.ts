import type { App } from 'vue';
// 注册所有 ICON
import * as antIcons from '@ant-design/icons-vue';

// base antd library
import {
  Affix,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Comment,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Flex,
  FloatButton,
  Form,
  Grid,
  Image,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  Mentions,
  Menu,
  message,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Popover,
  Progress,
  QRCode,
  Radio,
  Rate,
  Result,
  Row,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  TimePicker,
  Tooltip,
  Tour,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  Upload,
} from 'ant-design-vue';

// collections components
const components = [
  Affix,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Comment,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Flex,
  FloatButton,
  Form,
  Grid,
  Image,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  Mentions,
  Menu,
  message,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Popover,
  Progress,
  QRCode,
  Radio,
  Rate,
  Result,
  Row,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Tour,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  Upload,
];

async function lazy_use_components(app: App) {
  components.forEach((component) => {
    // 用于全局注册一个组件，使得该组件可以在整个应用的任何地方被使用，而无需在每个组件中单独导入
    // const { name } = component;
    // if (name) {
    // app.component(name, component);
    // }
    // 主要用于安装Vue插件, 使得插件可以去使用
    // 和上面注册组件不能同时使用
    // 有个问题，会提示 Component "XXX" has already been registered in target app.找不到原因
    if (component.install) {
      app.use(component);
    }
  });
  console.warn('[Admin-system-pro] NOTICE: Antd Components use lazy-load.');
}

async function lazy_use_icons(app: App) {
  // 注册图标组件
  Object.keys(antIcons).forEach((key) => {
    app.component(key, antIcons[key]);
  });
  console.warn('[Admin-system-pro] NOTICE: Antd use Icons lazy-load.');
}

export { lazy_use_components, lazy_use_icons };