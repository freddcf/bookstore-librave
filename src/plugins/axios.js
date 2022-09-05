// import Vue from 'vue';
import axios from 'axios';

// axios.defaults.baseURL =
//   'https://bookstore-manager-app-api.herokuapp.com/api/v1';

// Vue.use({
//   install(Vue) {
//     Vue.prototype.$http = axios;
//   },
// });

const http = axios.create({
  baseURL: 'https://bookstore-manager-app-api.herokuapp.com/api/v1',
});

export default http;
