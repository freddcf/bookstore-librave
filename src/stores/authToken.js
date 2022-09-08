import { defineStore } from 'pinia';

export const useAuthToken = defineStore('adminJwt', {
  state: () => ({
    jwtToken: '',
  }),
  getters: {
    retriveToken: (state) => state.jwtToken,
  },
});
