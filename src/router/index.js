import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import UserView from '@/views/UserView.vue';
import AdminView from '@/views/AdminView.vue';
import PublisherView from '@/views/PublisherView.vue';
import BookView from '@/views/BookView.vue';
import RentalView from '@/views/RentalView.vue';
import LoginView from '@/views/LoginView.vue';
import LoginRecoverView from '@/views/LoginRecoverView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
  },
  {
    path: '/publisher',
    name: 'publisher',
    component: PublisherView,
  },
  {
    path: '/book',
    name: 'book',
    component: BookView,
  },
  {
    path: '/rental',
    name: 'rental',
    component: RentalView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/recover',
    name: 'recover',
    component: LoginRecoverView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: HomeView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
