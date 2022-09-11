import http from '@/plugins/axios';

export default {
  getAll: () => {
    return http.get('/users');
  },
  getById: (id) => {
    return http.get(`/users/${id}`);
  },
  post: (user) => {
    return http.post('/users', user);
  },
  put: (id, user) => {
    return http.put(`/users/${id}`, user);
  },
  delete: (id) => {
    return http.delete(`/users/${id}`);
  },

  postAdmin: (token, user) => {
    return http.post('/users/admin', user, {
      headers: {
        Authorization: token,
      },
    });
  },
  putAdmin: (token, id, user) => {
    return http.put(`/users/admin/${id}`, user, {
      headers: {
        Authorization: token,
      },
    });
  },
  deleteAdmin: (token, id) => {
    return http.delete(`/users/admin/${id}`, {
      headers: {
        Authorization: token,
      },
    });
  },

  authenticate: (user) => {
    return http.post('/users/authenticate', user);
  },
  recoverPassword: (user) => {
    return http.post('/users/recover', user);
  },
};
