import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useAuthToken = defineStore('adminJwt', {
  state: () => ({
    jwtToken: '',
  }),
  getters: {
    getToken() {
      return computed(() => this.jwtToken);
    },
  },
  actions: {
    setToken(val) {
      this.jwtToken = 'Bearer ' + val;
    },
  },
});
