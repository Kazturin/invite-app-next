import { createRouter, createWebHistory } from "vue-router";

import store from "../store";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const routes = [
  {
    path: "/",
    component: () => import('@/layouts/Header.vue'),
    children: [
      {
          path: "/",
          name: "Main",
          component: () => import('@/views/Main.vue'),
      },
      {
        path: "/app/select-template/:invitation_id?",
        name: "Step1",
        component: () => import('@/views/app/SelectTemplate.vue'),
      },
      {
        path: "/app/invitation-create/:id",
        name: "Step2",
        component: () => import('@/views/app/InvitationCreate.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: "/app/invitation-create/:id/details",
        name: "Step3",
        component: () => import('@/views/app/EventCreate.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: "/app/invitation-edit/:id",
        name: "InvitationEdit",
        component: () => import('@/views/app/InvitationEdit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: "/app/invitation-edit/:id/details",
        name: "EventUpdate",
        component: () => import('@/views/app/EventUpdate.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: "/app/invitation-edit/:id/last-step",
        name: "LastStep",
        component: () => import('@/views/app/LastStep.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: "/app/my-invitations",
        name: "MyEvents",
        component: () => import('@/views/MyEvents.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: "/app/my-invitation/:id",
        name: "MyEvent",
        component: () => import('@/views/MyEvent.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: "/feedback",
        name: "Feedback",
        component: () => import('@/views/Feedback.vue'),
      },
    ],
  },
  {
    path: "/app/invitation-edit/:id/preview",
    name: 'Preview',
    component: () => import('@/views/app/Preview.vue'),
  },
  {
    path: "/toi/:slug/:lang?",
    name: "Invitation",
    component: () => import('@/views/Invitation.vue'),
  },
  {
     path: "/forbidden",
     name: "Forbidden",
     component: () => import('@/views/PageForbidden.vue'),
  },
  {
    path: "/auth",
    redirect: "/login",
    name: "Auth",
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: {isGuest: true},
    children: [
      {
        path: "/login",
        name: "Login",
        component: () => import('@/views/Login.vue'),
      },
      {
        path: "/register",
        name: "Register",
        component: () => import('@/views/Register.vue'),
      },
        {
            path: "/forgot-password",
            name: "ForgotPassword",
            component: () => import('@/views/ForgotPassword.vue'),
        },
        {
            path: "/reset-password/:token",
            name: "ResetPassword",
            component: () => import('@/views/ResetPassword.vue'),
        }
    ],
  },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/PageNotFound.vue'),
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
//  scrollBehavior() {
//    return { top: 0, left: 0 }
//  }
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.meta.requiresAuth && !store.state.user.token) {
    next({ name: "Login" });
  } else if (store.state.user.token && to.meta.isGuest) {
    next({ name: "Main" });
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
