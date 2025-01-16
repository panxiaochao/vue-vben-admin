import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-settings',
      keepAlive: true,
      order: 1001,
      title: $t('system.manage.title'),
    },
    name: 'system',
    path: '/system',
    children: [
      {
        meta: {
          icon: 'mdi:shield-key-outline',
          title: '权限设置',
        },
        name: 'SystemPermission',
        path: '/system/permission',
        children: [
          {
            name: 'SystemUser',
            path: '/system/permission/user',
            component: () => import('#/views/system/permission/user/index.vue'),
            meta: {
              title: '用户管理',
            },
          },
          {
            name: 'SystemOrg',
            path: '/system/permission/org',
            component: () => import('#/views/_core/fallback/not-found.vue'),
            meta: {
              title: '机构管理',
            },
          },
          {
            name: 'SystemRole',
            path: '/system/permission/role',
            component: () => import('#/views/system/permission/role/index.vue'),
            meta: {
              title: '角色管理',
            },
          },
          {
            name: 'SystemPost',
            path: '/system/permission/post',
            component: () => import('#/views/system/permission/post/index.vue'),
            meta: {
              title: '岗位管理',
            },
          },
          {
            name: 'SystemMenu',
            path: '/system/permission/menu',
            component: () => import('#/views/system/permission/menu/index.vue'),
            meta: {
              title: '菜单管理',
            },
          },
        ],
      },
      {
        name: 'SystemTenant',
        path: '/system/tenant',
        meta: {
          icon: 'mdi:shield-user-outline',
          title: '租户管理',
        },
        children: [
          {
            name: 'SystemTenantUser',
            path: '/system/tenant/user',
            component: () => import('#/views/system/tenant/user/index.vue'),
            meta: {
              title: '租户用户',
            },
          },
          {
            name: 'SystemTenantPackage',
            path: '/system/tenant/package',
            component: () => import('#/views/system/tenant/package/index.vue'),
            meta: {
              title: '租户套餐',
            },
          },
        ],
      },
      {
        meta: {
          icon: 'tdesign:system-setting',
          title: '系统设置',
        },
        name: 'SystemSettings',
        path: '/system/settings',
        children: [
          {
            name: 'SystemArea',
            path: '/system/settings/area',
            component: () => import('#/views/system/settings/area/index.vue'),
            meta: {
              title: '行政区域',
            },
          },
          {
            name: 'SystemDictionary',
            path: '/system/settings/dictionary',
            component: () =>
              import('#/views/system/settings/dictionary/index.vue'),
            meta: {
              title: '数据字典',
            },
          },
          {
            name: 'SystemOnline',
            path: '/system/settings/online',
            component: () => import('#/views/system/settings/online/index.vue'),
            meta: {
              title: '在线会话',
            },
          },
          {
            name: 'SystemParams',
            path: '/system/settings/params',
            component: () => import('#/views/system/settings/param/index.vue'),
            meta: {
              title: '系统参数',
            },
          },
        ],
      },
      {
        name: 'SystemLog',
        path: '/system/log',
        meta: {
          icon: 'ph:log',
          title: '日志管理',
        },
        children: [
          {
            name: 'SystemLogLogin',
            path: '/system/log/login',
            component: () => import('#/views/system/log/login/index.vue'),
            meta: {
              title: '访问日志',
            },
          },
          {
            name: 'SystemLogOperate',
            path: '/system/log/operate',
            component: () => import('#/views/system/log/operate/index.vue'),
            meta: {
              title: '操作日志',
            },
          },
        ],
      },
      {
        name: 'SystemMonitor',
        path: '/system/monitor',
        meta: {
          icon: 'ic:baseline-monitor-heart',
          title: '监控管理',
        },
        children: [
          {
            name: 'SystemMonitorServer',
            path: '/system/monitor/server',
            component: () => import('#/views/system/monitor/server/index.vue'),
            meta: {
              title: '系统监控',
            },
          },
          {
            name: 'SystemMonitorRedis',
            path: '/system/monitor/redis',
            component: () => import('#/views/system/monitor/redis/index.vue'),
            meta: {
              title: 'Redis监控',
            },
          },
        ],
      },
      {
        name: 'SystemDevelopment',
        path: '/system/development',
        meta: {
          icon: 'mdi:code-block-tags',
          title: '开发管理',
        },
        children: [
          {
            name: 'SystemDatabaseSource',
            path: '/system/development/datasource',
            component: () =>
              import('#/views/system/development/datasource/index.vue'),
            meta: {
              title: '数据源',
            },
          },
          {
            name: 'SystemDatabaseField',
            path: '/system/development/field',
            component: () =>
              import('#/views/system/development/field/index.vue'),
            meta: {
              title: '字段类型',
            },
          },
          {
            name: 'SystemCodeGen',
            path: '/system/development/codegen',
            component: () =>
              import('#/views/system/development/codegen/index.vue'),
            meta: {
              title: '代码生成',
            },
          },
          {
            name: 'SystemCodeGenEdit',
            path: '/system/development/codegen/gen',
            component: () =>
              import('#/views/system/development/codegen/gen/index.vue'),
            meta: {
              // hideInMenu: true,
              title: '生成代码',
            },
          },
        ],
      },
    ],
  },
];

export default routes;
