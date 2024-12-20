import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: $t('exchange.manage.title'),
    },
    name: 'Exchange',
    path: '/exchange',
    children: [
      {
        name: 'Forex Analysis',
        path: '/exchange/forex_analysis',
        component: () => import('#/views/exchange/analysis/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: $t('exchange.manage.analysis.title'),
        },
      },
    ],
  },
];

export default routes;
