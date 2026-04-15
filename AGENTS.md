# AGENTS.md

## Setup

```bash
# Required: Node >=20.10.0, pnpm >=9.12.0 (enforced)
npm i -g corepack
pnpm install
```

## Commands

| Command                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| `pnpm dev`                | Start all dev servers (turbo-run)            |
| `pnpm dev:play`           | Playground dev server only                   |
| `pnpm dev:system-admin`   | Main admin app dev server                    |
| `pnpm build`              | Build all packages/apps                      |
| `pnpm build:play`         | Build playground only                        |
| `pnpm build:system-admin` | Build admin app only                         |
| `pnpm test:unit`          | Run unit tests (vitest, happy-dom)           |
| `pnpm test:e2e`           | Run e2e tests (playwright)                   |
| `pnpm lint`               | ESLint + Stylelint all                       |
| `pnpm format`             | Prettier format all                          |
| `pnpm check`              | Full check: circular deps, dep, type, cspell |
| `pnpm check:type`         | TypeScript check via turbo                   |
| `pnpm commit`             | Interactive commit (czg)                     |

## Monorepo Structure

- `apps/` - Main apps: `@vben/admin-system-pro`, `@vben/backend-mock`
- `packages/` - Shared: constants, locales, styles, utils, types, stores, preferences
- `packages/@core/` - Core: base, composables, ui-kit, preferences
- `packages/effects/` - Effects: access, common-ui, hooks, layouts, plugins, request
- `packages/@pxc/` - Extensions: echarts, codemirror
- `playground/` - Dev testing environment
- `internal/` - Build tools: vite-config, tsconfig, lint-configs, tailwind-config

## Important Notes

- **pnpm enforced**: `preinstall` blocks non-pnpm usage
- **Pre-commit hooks**: lefthook runs prettier + eslint + stylelint on staged `.vue/.ts/.tsx/.scss` files
- **Commit format**: Angular conventional commits (`feat:`, `fix:`, `chore:`, etc.) - use `pnpm commit`
- **Build ordering**: Turbo builds depend on `^build` (dependencies must build first)
- **Workspace catalogs**: Dependencies use `catalog:` in `pnpm-workspace.yaml`, resolved at install time
- **Type checking**: Uses `vue-tsc --noEmit --skipLibCheck`

## Testing

- Unit tests: `vitest` with `happy-dom` environment, exclude `**/e2e/**`
- E2E tests: `playwright` in `playground/`

## 开发模式 (基于 role 模块)

### 目录结构

```
src/views/{module}/{feature}/
├── index.ts              # 类型定义 + 表格列定义
├── index.vue             # 列表页面
└── form/                 # 表单组件目录
    ├── form.ts           # 表单类型、默认值、验证规则
    ├── add-form.vue      # 新增表单
    ├── edit-form.vue     # 编辑表单
    └── xxx-form.vue      # 其他业务表单
```

### index.ts 结构

```typescript
// 业务类型定义
export interface RowType {
  id: string;
  roleName: string;
  roleCode: string;
  remark: string;
  sort: number;
  state: string;
}

// 表格列定义
export const columns = [
  { field: 'roleName', title: '角色名称' },
  { field: 'roleCode', title: '角色编码' },
  { field: 'remark', title: '描述' },
  { field: 'sort', title: '排序' },
  { field: 'state', title: '状态', width: 80, slots: { default: 'state' } },
  { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
];
```

### 列表页 (index.vue) 结构

- 使用 `useVbenVxeGrid` 封装表格组件
- 使用 `Page` 组件包裹，设置 `auto-content-height`
- 使用 `a-modal` 或 `useVbenDrawer` 处理表单弹窗
- 搜索表单定义在 `formOptions.schema`
- 表格数据通过 `proxyConfig.ajax.query` 加载
- 刷新方法：`gridApi.reload()` 或 `gridApi.query()`

### 表单组件模式

```typescript
// form.ts - 表单类型和配置
export interface FormState {
  id?: string;
  roleName?: string;
  roleCode?: string;
  // ...其他字段
}

export const defaultModel = {
  id: undefined,
  roleName: undefined,
  // ...默认值
};

export const rulesRef = reactive({
  roleName: [{ required: true, message: '请输入角色名称' }],
});

export const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

// 使用 ant-design-vue 表单验证
export const useRoleForm = (modelRef: FormState) => {
  return Form.useForm(modelRef, rulesRef);
};
```

```vue
<!-- add-form.vue / edit-form.vue -->
<script setup lang="ts">
import { defineEmits, reactive, ref, toRaw } from 'vue';
import { message } from 'ant-design-vue';

// 使用 defineModel 定义 v-model
const open = defineModel('open', { type: Boolean, default: false });
const width = defineModel('width', { type: Number, default: 800 });

// 定义事件
const $emits = defineEmits(['done']);

// 表单数据
const modelRef = reactive<FormState>({ ...defaultModel });
const { resetFields, validate, validateInfos } = useRoleForm(modelRef);

// 打开弹窗
const openModal = async () => {
  open.value = true;
  // 加载下拉选项等
};

// 提交
const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    save(values).then(() => {
      resetFields();
      open.value = false;
      $emits('done'); // 通知父组件刷新
    });
  });
};

// 暴露方法
defineExpose({
  openModal,
});
</script>

<template>
  <a-modal
    :open="open"
    :width="width"
    title="新建/编辑"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form v-bind="formItemLayout">
      <!-- 表单项 -->
    </a-form>
  </a-modal>
</template>
```

### API 接口规范

位置：`src/api/{module}/{feature}.ts`

```typescript
import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

// 分页查询
export async function page(params: object) {
  return requestClient.get(`${VITE_PROJECT_API_URL}/system/v1/xxx/page`, {
    params,
  });
}

// 新增
export async function save(data: object) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/system/v1/xxx`, data);
}

// 编辑
export async function update(data: object) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/xxx`, data);
}

// 删除
export async function deleteById(id: string) {
  return requestClient.delete(`${VITE_PROJECT_API_URL}/system/v1/xxx/${id}`);
}

// 其他业务接口
export async function selectDataScopes() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/xxx/selectDataScopes`,
  );
}
```

### 常用组件

- 表格：`<Grid />` (useVbenVxeGrid)
- 弹窗：`<a-modal>` 或 `useVbenDrawer`
- 消息提示：`import { message } from 'ant-design-vue'`
- 按钮：`import { Button } from 'ant-design-vue'` 或直接用 `<a-button>`
- 图标：`<template #icon><XXXOutlined /></template>`

### 操作列模板示例

```vue
<template #action="{ row }">
  <a-button type="link" @click="editForm.openModal(row)">编辑</a-button>
  <a-divider type="vertical" />
  <a-button type="link" @click="grantForm.openModal(row)">授权</a-button>
  <a-divider type="vertical" />
  <a-popconfirm title="确定要删除吗?" @confirm="deleteRow(row)">
    <a-button type="link" danger>删除</a-button>
  </a-popconfirm>
</template>
```
