import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: ':eventId',
        component: () => import('pages/PlanningPage.vue'),
      },
      {
        path: ':eventId/benevoles',
        component: () => import('pages/BenevolesPage.vue'),
      },
      {
        path: ':eventId/benevoles/:id',
        component: () => import('pages/BenevolesPage.vue'),
      },
      {
        path: ':eventId/periodes',
        component: () => import('pages/PeriodesPage.vue'),
      },
      {
        path: ':eventId/periodes/:id',
        component: () => import('pages/PeriodesPage.vue'),
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
