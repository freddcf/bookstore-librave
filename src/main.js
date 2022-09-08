import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { createPinia, PiniaVuePlugin } from 'pinia';
import VueSweetalert2 from 'vue-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import './plugins/axios';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false;
Vue.use(PiniaVuePlugin);
Vue.use(VueSweetalert2);

const pinia = createPinia();
const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  timer: 7000,
  timerProgressBar: true,
  showConfirmButton: false,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});
window.Toast = Toast;

new Vue({
  router,
  vuetify,
  pinia,
  render: (h) => h(App),
}).$mount('#app');
