import type { App } from 'vue';

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

async function lazy_use(app: App) {
  components.forEach((component) => {
    // 用于全局注册一个组件，使得该组件可以在整个应用的任何地方被使用，而无需在每个组件中单独导入
    // const { name } = component;
    // app.component(name, component);
    // 主要用于安装Vue插件, 使得插件可以去使用
    // 有个问题，会提示 Component "XXX" has already been registered in target app.找不到原因
    // app.use(component)
  });

  // 主要用于安装Vue插件, 使得插件可以去使用
  // app.use(Select)
  //   .use(Alert)
  //   .use(Button)
  //   .use(Breadcrumb)
  //   .use(Checkbox)
  //   .use(DatePicker)
  //   .use(TimePicker)
  //   .use(Calendar)
  //   .use(Radio)
  //   .use(Switch)
  //   .use(Card)
  //   .use(List)
  //   .use(Descriptions)
  //   .use(Tree)
  //   .use(TreeSelect)
  //   .use(Table)
  //   .use(Divider)
  //   .use(Modal)
  //   .use(Drawer)
  //   .use(Dropdown)
  //   .use(Tag)
  //   .use(Tooltip)
  //   .use(Badge)
  //   .use(Popover)
  //   .use(Upload)
  //   .use(Transfer)
  //   .use(Steps)
  //   .use(PageHeader)
  //   .use(Result)
  //   .use(Empty)
  //   .use(Avatar)
  //   .use(Menu)
  //   .use(Tabs)
  //   .use(Form)
  //   .use(Input)
  //   .use(Row)
  //   .use(Col)
  //   .use(Spin)
  //   .use(Space)
  //   .use(Layout)
  //   .use(Collapse)
  //   .use(Slider)
  //   .use(InputNumber)
  //   .use(Carousel)
  //   .use(Popconfirm)
  //   .use(Skeleton)
  //   .use(Cascader)
  //   .use(Rate)
  //   .use(Progress);
  console.warn('[System-admin-pro] NOTICE: Antd use lazy-load.');
}

export { lazy_use };
