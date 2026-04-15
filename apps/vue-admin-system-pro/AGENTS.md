# Vue Admin System Pro - 开发指南

## 项目概述

基于 [vue-vben-admin 5.0](https://github.com/vbenjs/vue-vben-admin) 的中后台管理系统，使用 Vue 3 + Vite + TypeScript + Ant Design Vue。

## 目录结构

```
apps/vue-admin-system-pro/
├── src/
│   ├── adapter/           # 组件适配器
│   │   ├── component/     # 组件懒加载配置
│   │   ├── form.ts        # 表单适配
│   │   └── vxe-table.ts   # 表格适配
│   ├── api/               # API 接口
│   │   ├── core/          # 核心 API (登录、刷新 token 等)
│   │   ├── system/        # 系统管理 API
│   │   ├── system-plus/   # 扩展系统 API
│   │   ├── examples/      # 示例 API
│   │   ├── request.ts     # 请求客户端配置
│   │   └── index.ts       # API 统一导出
│   ├── locales/           # 国际化
│   │   └── langs/
│   │       ├── zh-CN/     # 中文
│   │       └── en-US/     # 英文
│   ├── router/            # 路由配置
│   │   ├── routes/
│   │   │   └── modules/   # 路由模块 (按业务划分)
│   │   ├── index.ts       # 路由创建
│   │   ├── guard.ts       # 路由守卫
│   │   └── access.ts      # 权限控制
│   ├── store/             # Pinia 状态管理
│   ├── views/             # 页面组件
│   │   ├── _core/         # 核心页面 (登录、403/404 等)
│   │   ├── system/        # 系统管理 (角色、菜单、部门)
│   │   ├── system-plus/   # 扩展系统
│   │   ├── demos/         # 示例页面
│   │   └── examples/      # 功能示例
│   ├── main.ts            # 应用入口
│   ├── bootstrap.ts       # 应用启动引导
│   ├── preferences.ts     # 项目偏好配置
│   └── app.vue            # 根组件
├── .env                   # 环境变量
├── vite.config.mts        # Vite 配置
└── tsconfig.json          # TypeScript 配置
```

## 核心文件说明

### main.ts

应用入口，负责初始化偏好设置和调用 bootstrap。

### bootstrap.ts

- 创建 Vue 实例
- 懒加载 Ant Design 组件和图标
- 初始化 i18n、Pinia、路由、权限指令
- 配置 Vue Query 和 Motion 插件

### router/routes/index.ts

动态加载 `modules/*.ts` 下的所有路由配置。

### api/request.ts

- 基于 `@vben/request` (axios 封装)
- 配置请求/响应拦截器
- Token 刷新机制
- BigInt 处理

## 开发模式

### 添加新页面

1. 创建页面组件：`src/views/{module}/{page}/index.vue`
2. 添加路由配置：`src/router/routes/modules/{module}.ts`

```typescript
// src/router/routes/modules/example.ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('#/layouts/basic.vue'),
    meta: { title: '示例', icon: 'lucide:app-window' },
    children: [
      {
        path: '/example/list',
        name: 'ExampleList',
        component: () => import('#/views/example/list/index.vue'),
        meta: { title: '示例列表' },
      },
    ],
  },
];

export default routes;
```

### 添加 API

在 `src/api/` 下创建模块，使用 `requestClient`：

```typescript
// src/api/example.ts
import { requestClient } from '#/api/request';

export namespace ExampleApi {
  export interface Item {
    id: string;
    name: string;
  }
}

export async function getList(params: any) {
  return requestClient.get<ExampleApi.Item[]>('/example/list', { params });
}
```

### 页面结构 (CRUD 模式)

参考 `src/views/system/role/`：

```
src/views/system/role/
├── data.ts           # 表格列和表单schema定义
├── list.vue          # 列表页面
└── modules/
    └── form.vue      # 表单抽屉组件
```

#### data.ts 模式

```typescript
// src/views/example/data.ts
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

// 表单 Schema
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
  ];
}

// 搜索表单 Schema
export function useGridFormSchema(): VbenFormSchema[] {
  return [{ component: 'Input', fieldName: 'name', label: '名称' }];
}

// 表格列定义
export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { field: 'name', title: '名称', width: 200 },
    { field: 'status', title: '状态', width: 100 },
    {
      field: 'operation',
      title: '操作',
      width: 130,
      cellRender: { name: 'CellOperation' },
    },
  ];
}
```

#### list.vue 模式

```vue
<script lang="ts" setup>
import { Page, useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getList, deleteItem } from '#/api';
import { $t } from '#/locales';

import { useColumns, useFormSchema, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getList({ page: page.currentPage, ...formValues });
        },
      },
    },
    rowConfig: { keyField: 'id' },
  },
});

function onActionClick({ code, row }) {
  switch (code) {
    case 'edit':
      formDrawerApi.open({ id: row.id });
      break;
    case 'delete':
      // 删除逻辑
      break;
  }
}
</script>

<template>
  <Page>
    <Grid />
    <FormDrawer />
  </Page>
</template>
```

## 常用命令

```bash
# 启动开发服务器
pnpm dev:system-admin

# 构建生产版本
pnpm build:system-admin

# 类型检查
pnpm -F @vben/admin-system-pro typecheck
```

## 技术栈

- **UI 框架**: Ant Design Vue
- **表格**: VXE Table (通过 adapter)
- **状态管理**: Pinia
- **请求**: Axios (通过 @vben/request)
- **国际化**: vue-i18n
- **路由**: vue-router
- **构建**: Vite

## 国际化

在 `src/locales/langs/{zh-CN|en-US}/` 下添加翻译文件：

```json
// src/locales/langs/zh-CN/example.json
{
  "example": {
    "title": "示例",
    "list": "示例列表"
  }
}
```

使用方式：

```typescript
import { $t } from '#/locales';
$t('example.title');
```
