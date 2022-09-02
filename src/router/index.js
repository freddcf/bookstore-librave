import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import UserView from '@/views/UserView.vue';
import PublisherView from '@/views/PublisherView.vue';
import BookView from '@/views/BookView.vue';
import RentalView from '@/views/RentalView.vue';
import LoginView from '@/views/LoginView.vue';

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
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
