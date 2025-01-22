import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { initTippy } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/antd';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { useTitle } from '@vueuse/core';

import {
  lazy_use_components,
  lazy_use_icons,
} from '#/adapter/component/antd_use';
import { $t, setupI18n } from '#/locales';
import { router } from '#/router';

import { initComponentAdapter } from './adapter/component';
import App from './app.vue';

async function bootstrap(namespace: string) {
  // 初始化组件适配器
  await initComponentAdapter();

  // // 设置弹窗的默认配置
  // setDefaultModalProps({
  //   fullscreenButton: false,
  // });
  // // 设置抽屉的默认配置
  // setDefaultDrawerProps({
  //   zIndex: 1020,
  // });

  const app = createApp(App);

  // 加载Antd组件
  await lazy_use_components(app);

  // 加载Antd Icons组件
  await lazy_use_icons(app);

  // 国际化 i18n 配置
  await setupI18n(app);

  // 配置 pinia-tore
  await initStores(app, { namespace });

  // 安装权限指令
  registerAccessDirective(app);

  // 初始化 tippy
  initTippy(app);

  // 配置路由及路由守卫
  app.use(router);

  // 配置@tanstack/vue-query
  app.use(VueQueryPlugin);

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle =
        (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });

  app.mount('#app');
}

export { bootstrap };
