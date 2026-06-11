# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Vue Vben Admin 5.x 是一个基于 Vue 3 + Vite + TypeScript 的 Monorepo 管理的中后台管理模板。

**Node 版本**: `^22.18.0 || ^24.0.0` | **pnpm**: `>=10.0.0`

## 常用命令

```bash
pnpm dev              # 启动所有开发服务器
pnpm dev:system-admin # 仅启动 vue-admin-system-pro 主应用
pnpm build            # 构建所有包
pnpm build:analyze    # 构建并分析包大小
pnpm check            # 运行所有检查 (type/circular/dep/cspell)
pnpm lint             # 代码检查
pnpm format           # 代码格式化
pnpm test:unit        # 单元测试 (vitest)
pnpm test:e2e         # E2E 测试 (playwright)
pnpm commit           # 交互式提交 (czg)
```

## 项目结构

```
apps/                        # 业务应用
├── backend-mock/            # Mock 服务 (nitro/h3)
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
packages/                    # 共享包
├── @core/                   # 核心包 (@vben/* 别名)
│   ├── base/                # 基础工具 (icons, typings, shared)
│   ├── composables/         # 组合式函数
│   ├── preferences/         # 用户偏好设置
│   └── ui-kit/              # UI 组件套件 (shadcn-ui, menu-ui)
├── effects/                 # 功能包
│   ├── access/              # 权限控制
│   ├── common-ui/           # 通用 UI 组件
│   ├── hooks/               # 生命周期 hooks
│   ├── layouts/             # 布局组件
│   ├── locales/             # 国际化
│   ├── plugins/             # 插件 (echarts, vxe-table, motion)
│   └── request/             # HTTP 请求 (axios 封装)
├── @pxc/                    # 扩展组件包 (codemirror, echarts)
├── constants/               # 常量定义
├── icons/                   # 图标
├── locales/                 # 国际化
├── preferences/             # 偏好设置
├── stores/                  # Pinia 状态管理
├── styles/                  # 样式
├── types/                   # TypeScript 类型定义
└── utils/                   # 工具函数
internal/                    # 内部工具配置
├── vite-config/             # Vite 配置共享
├── tsconfig/                # TypeScript 配置
├── tailwind-config/         # Tailwind CSS 配置
└── lint-configs/            # ESLint/Stylelint/Commitlint 配置
```

## 包管理规范

- **强制使用 pnpm**：preinstall 脚本禁止其他包管理器
- **工作区协议**：`workspace:*` 用于本地包引用
- **Catalog 模式**：依赖版本在 `pnpm-workspace.yaml` 的 `catalog:` 中集中管理

## 开发约定

### 路径别名
`#/` 指向应用内 `src/` 目录（在 `tsconfig.json` 和 `package.json` imports 中定义）。

### 添加新页面
1. 创建组件：`src/views/{module}/{page}/index.vue`
2. 添加路由：`src/router/routes/modules/{module}.ts`
3. 国际化：添加翻译到 `src/locales/langs/{zh-CN|en-US}/`

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

## 技术栈

- **框架**: Vue 3.5 + Vite 8 + TypeScript 6
- **UI**: Ant Design Vue 4 + VXE Table
- **状态**: Pinia 3 + vue-i18n 11 + vue-router 5
- **构建**: vite + tsdown
- **样式**: Tailwind CSS 4 + SCSS
- **包管理**: pnpm 10 + turbo 2

## 详细文档

- [完整 AGENTS.md](./AGENTS.md) - 包含架构图、详细开发指南
- [App 级别 AGENTS.md](./apps/vue-admin-system-pro/AGENTS.md) - 主应用详细开发指南
- [Vue Vben Admin 官方文档](https://doc.vben.pro/)