import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PlanningPage.vue') },
      {
        path: 'benevoles',
        component: () => import('pages/BenevolesPage.vue'),
        children: [
          { path: ':id', component: () => import('pages/BenevolesPage.vue') },
        ],
      },
      {
        path: 'periodes',
        component: () => import('pages/PeriodesPage.vue'),
        children: [
          { path: ':id', component: () => import('pages/PeriodesPage.vue') },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
