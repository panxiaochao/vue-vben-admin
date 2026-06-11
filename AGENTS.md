# AGENTS.md

## 项目概述

Vue Vben Admin 5.x - 基于 Vue 3 + Vite + TypeScript 的 monorepo 管理的后台管理系统。

## 环境要求

- **Node.js**: `^22.18.0 || ^24.0.0`
- **pnpm**: `>=10.0.0`
- **初始化**: `npm i -g corepack && corepack enable`

## 包管理器

pnpm 10+ (已锁定在 `packageManager: pnpm@10.33.4`)，`.npmrc` 使用 npmmirror 镜像。

## Monorepo 结构

```
apps/                        # 业务应用
├── backend-mock/            # Nitro/H3 Mock 后端服务
playground/                  # 主应用入口 (包含业务代码)
├── src/
│   ├── adapter/             # 适配器 (vxe-table 等)
│   ├── api/                 # API 接口定义
│   ├── layouts/             # 布局组件
│   ├── locales/             # 国际化
│   ├── router/              # 路由配置
│   ├── store/               # 状态管理
│   ├── utils/               # 工具函数
│   └── views/               # 页面视图
│       ├── _core/           # 核心页面
│       ├── dashboard/       # 仪表盘
│       ├── demos/           # 示例
│       ├── examples/        # 组件示例
│       ├── system/          # 系统管理
│       └── system-plus/     # 系统扩展
internal/                    # 共享构建配置和工具
├── lint-configs/            # eslint-config, oxlint-config, oxfmt-config, stylelint-config, commitlint-config
├── node-utils/              # Node 工具函数
├── tailwind-config/         # Tailwind CSS 配置
├── tsconfig/                # 共享 TypeScript 配置
└── vite-config/             # 共享 Vite 配置
packages/
├── @core/                   # 核心包
│   ├── base/                # design, icons, shared, typings
│   ├── ui-kit/              # form-ui, layout-ui, menu-ui, popup-ui, shadcn-ui, tabs-ui
│   ├── composables/         # 组合式函数
│   └── preferences/         # 用户偏好设置
├── @pxc/                    # 扩展组件包
│   ├── codemirror/          # 代码编辑器
│   └── echarts/             # 图表组件
├── effects/                 # access, common-ui, hooks, layouts, plugins, request
└── */                       # utils, stores, types, styles, locales, constants, icons
scripts/                     # vsh (lint 工具), turbo-run (dev 脚本), deploy
```

## 依赖管理

- **Workspace 协议**: `workspace:*` 用于内部包引用
- **Catalog 协议**: `catalog:` 用于统一版本管理（在 `pnpm-workspace.yaml` 中定义）
- **postinstall**: 自动运行 `pnpm -r run stub --if-present` 构建内部包

## 常用命令

```bash
# 开发
pnpm dev              # 启动 playground 开发服务器 (使用 turbo-run)
pnpm preview          # 预览 build 产物

# 构建
pnpm build            # 全量构建 (NODE_OPTIONS=--max-old-space-size=8192 turbo build)
pnpm build:analyze    # 构建并分析 bundle

# 代码质量
pnpm lint             # 运行 oxlint 和 stylelint (通过 vsh)
pnpm format           # 运行 oxfmt 格式化代码
pnpm check:type       # 运行 vue-tsc 类型检查 (turbo run typecheck)
pnpm check            # 完整检查: circular-dep, dep, type, cspell

# 测试
pnpm test:unit        # 运行 vitest (happy-dom 环境)
pnpm test:e2e         # 运行 playwright e2e 测试

# Git/版本
pnpm commit           # 交互式提交 (czg)
pnpm changeset        # 创建 changeset
pnpm version          # 应用 changeset 版本更新
```

## CI 流水线

`ci.yml` 运行三组并行 job:

1. **test**: `pnpm run test:unit`
2. **lint**: `pnpm run lint`
3. **check**: `pnpm check:type` + actionlint

CI 仅在 `github.repository == 'vbenjs/vue-vben-admin'` 时运行。

## Git Hooks (lefthook)

```yaml
pre-commit:
  - lint: pnpm lint
  - checkType: pnpm check:type
commit-msg:
  - commitlint: pnpm exec commitlint --edit $1
post-merge:
  - install: pnpm install
```

## 代码规范

- **Linter**: oxlint (配置: `@vben/oxlint-config`)
- **Formatter**: oxfmt (配置: `@vben/oxfmt-config`)
- **Stylelint**: stylelint (配置: `@vben/stylelint-config`)
- **Commit**: Conventional Commits (Angular 规范，配置: `@vben/commitlint-config`)
- **TypeScript**: 共享 tsconfig 来自 `@vben/tsconfig`

## 内部包引用方式

```json
{
  "@vben/utils": "workspace:*",
  "@vben/vite-config": "workspace:*",
  "vue": "catalog:"
}
```

## 构建依赖顺序

Turbo 的 `build` task 使用 `dependsOn: ["^build"]`，确保依赖先构建。

## 测试配置

- **单元测试**: vitest + happy-dom
- **E2E 测试**: playwright (`playground/playwright.config.ts`)
- **happy-dom**: v20+ 默认禁用 JS 评估，`handleDisabledFileLoadingAsSuccess: true` 保持测试行为

## 开发约定

### 路径别名

`#/` 指向应用内 `src/` 目录（在 `tsconfig.json` 和 `package.json` imports 中定义）。

### 添加新页面

1. 创建组件：`src/views/{module}/{page}/index.vue`
2. 添加路由：`src/router/routes/modules/{module}.ts`
3. 国际化：添加翻译到 `src/locales/langs/{zh-CN|en-US}/`

### API 定义

使用 `requestClient`（基于 axios）在 `src/api/` 下按模块组织。

### CRUD 页面模式

参考 `playground/src/views/system-plus/permission/role/` 结构：

```
{module}/                       # 模块目录
├── index.ts                    # 字段类型定义 + columns 定义
├── index.vue                   # 列表页面 (useVbenVxeGrid)
└── form/                       # 表单相关
    ├── form.ts                 # 表单状态、默认值、校验规则、表单布局
    ├── add-form.vue            # 新增表单 (defineModel + defineExpose)
    ├── edit-form.vue           # 编辑表单
    └── xxx-form.vue            # 其他表单（如授权）
```

**列表页面 (index.vue)**:

- 使用 `useVbenVxeGrid` 组合式函数管理表格和搜索表单
- 工具栏按钮通过 `#toolbar-actions` slot 添加
- 操作列通过 `#action` slot 自定义操作按钮
- 通过 `defineExpose({ openModal })` 暴露方法，父组件调用 `xxxForm.openModal(row)` 打开表单

**表单组件 (xxx-form.vue)**:

- 使用 `defineModel('open', { type: Boolean })` 控制显示
- 使用 `defineExpose({ openModal })` 暴露打开方法
- 表单完成后通过 `$emits('done')` 通知父组件刷新
- 使用 Ant Design Vue Form + `useRoleForm` 组合式函数

### 环境变量

```
.env              # 通用变量
.env.development  # 开发环境
.env.production   # 生产环境
.env.analyze      # 构建分析
```

## 热知识

- `.npmrc` 配置了 npmmirror 镜像源
- `scripts/vsh` 是自定义 lint 工具，封装了 oxlint/oxfmt/stylelint/cspell
- `scripts/turbo-run` 是自定义 dev 启动脚本
- `playground/` 是主应用入口，不是独立包
- `apps/backend-mock` 是独立的 Nitro 服务器，提供 API mock
- `packages/@core/ui-kit/shadcn-ui` 是 shadcn/ui 组件库封装
- 使用 `@changesets/cli` 管理版本和 changelog
