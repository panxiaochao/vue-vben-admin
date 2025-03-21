import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ion:settings-outline',
      keepAlive: true,
      order: 1001,
      title: $t('system-plus.manage.title'),
    },
    name: 'system',
    path: '/system-plus',
    children: [
      {
        meta: {
          icon: 'mdi:shield-key-outline',
          title: '权限设置',
        },
        name: 'SystemPlusPermission',
        path: '/system-plus/permission',
        children: [
          {
            name: 'SystemPlusUser',
            path: '/system-plus/permission/user',
            component: () =>
              import('#/views/system-plus/permission/user/index.vue'),
            meta: {
              title: '用户管理',
            },
          },
          {
            name: 'SystemPlusOrg',
            path: '/system-plus/permission/org',
            component: () => import('#/views/_core/fallback/not-found.vue'),
            meta: {
              title: '机构管理',
            },
          },
          {
            name: 'SystemPlusRole',
            path: '/system-plus/permission/role',
            component: () =>
              import('#/views/system-plus/permission/role/index.vue'),
            meta: {
              title: '角色管理',
            },
          },
          {
            name: 'SystemPlusPost',
            path: '/system-plus/permission/post',
            component: () =>
              import('#/views/system-plus/permission/post/index.vue'),
            meta: {
              title: '岗位管理',
            },
          },
          {
            name: 'SystemPlusMenu',
            path: '/system-plus/permission/menu',
            component: () =>
              import('#/views/system-plus/permission/menu/index.vue'),
            meta: {
              title: '菜单管理',
            },
          },
        ],
      },
      {
        name: 'SystemPlusTenant',
        path: '/system-plus/tenant',
        meta: {
          icon: 'mdi:shield-user-outline',
          title: '租户管理',
        },
        children: [
          {
            name: 'SystemPlusTenantUser',
            path: '/system-plus/tenant/user',
            component: () =>
              import('#/views/system-plus/tenant/user/index.vue'),
            meta: {
              title: '租户用户',
            },
          },
          {
            name: 'SystemPlusTenantPackage',
            path: '/system-plus/tenant/package',
            component: () =>
              import('#/views/system-plus/tenant/package/index.vue'),
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
        name: 'SystemPlusSettings',
        path: '/system-plus/settings',
        children: [
          {
            name: 'SystemPlusArea',
            path: '/system-plus/settings/area',
            component: () =>
              import('#/views/system-plus/settings/area/index.vue'),
            meta: {
              title: '行政区域',
            },
          },
          {
            name: 'SystemPlusDictionary',
            path: '/system-plus/settings/dictionary',
            component: () =>
              import('#/views/system-plus/settings/dictionary/index.vue'),
            meta: {
              title: '数据字典',
            },
          },
          {
            name: 'SystemPlusOnline',
            path: '/system-plus/settings/online',
            component: () =>
              import('#/views/system-plus/settings/online/index.vue'),
            meta: {
              title: '在线会话',
            },
          },
          {
            name: 'SystemPlusParams',
            path: '/system-plus/settings/params',
            component: () =>
              import('#/views/system-plus/settings/param/index.vue'),
            meta: {
              title: '系统参数',
            },
          },
        ],
      },
      {
        name: 'SystemPlusLog',
        path: '/system-plus/log',
        meta: {
          icon: 'ph:log',
          title: '日志管理',
        },
        children: [
          {
            name: 'SystemPlusLogLogin',
            path: '/system-plus/log/login',
            component: () => import('#/views/system-plus/log/login/index.vue'),
            meta: {
              title: '访问日志',
            },
          },
          {
            name: 'SystemPlusLogOperate',
            path: '/system-plus/log/operate',
            component: () =>
              import('#/views/system-plus/log/operate/index.vue'),
            meta: {
              title: '操作日志',
            },
          },
        ],
      },
      {
        name: 'SystemPlusMonitor',
        path: '/system-plus/monitor',
        meta: {
          icon: 'ic:baseline-monitor-heart',
          title: '监控管理',
        },
        children: [
          {
            name: 'SystemPlusMonitorServer',
            path: '/system-plus/monitor/server',
            component: () =>
              import('#/views/system-plus/monitor/server/index.vue'),
            meta: {
              title: '系统监控',
            },
          },
          {
            name: 'SystemPlusMonitorRedis',
            path: '/system-plus/monitor/redis',
            component: () =>
              import('#/views/system-plus/monitor/redis/index.vue'),
            meta: {
              title: 'Redis监控',
            },
          },
        ],
      },
      {
        name: 'SystemPlusDevelopment',
        path: '/system-plus/development',
        meta: {
          icon: 'mdi:code-block-tags',
          title: '开发管理',
        },
        children: [
          {
            name: 'SystemPlusDatabaseSource',
            path: '/system-plus/development/datasource',
            component: () =>
              import('#/views/system-plus/development/datasource/index.vue'),
            meta: {
              title: '数据源',
            },
          },
          {
            name: 'SystemPlusDatabaseField',
            path: '/system-plus/development/field',
            component: () =>
              import('#/views/system-plus/development/field/index.vue'),
            meta: {
              title: '字段类型',
            },
          },
          {
            name: 'SystemPlusCodeGen',
            path: '/system-plus/development/codegen',
            component: () =>
              import('#/views/system-plus/development/codegen/index.vue'),
            meta: {
              title: '代码生成',
            },
          },
          {
            name: 'SystemPlusTemplate',
            path: '/system-plus/development/template',
            component: () =>
              import('#/views/system-plus/development/template/index.vue'),
            meta: {
              title: '模版管理',
            },
          },
          {
            name: 'SystemPlusTemplateGroup',
            path: '/system-plus/development/template-group',
            component: () =>
              import(
                '#/views/system-plus/development/template-group/index.vue'
              ),
            meta: {
              title: '模版分组',
            },
          },
        ],
      },
    ],
  },
];

export default routes;
