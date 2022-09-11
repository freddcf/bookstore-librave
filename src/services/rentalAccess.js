import http from '@/plugins/axios';

export default {
  getAll: (token) => {
    return http.get('/rentals', {
      headers: {
        Authorization: token,
      },
    });
  },
  getById: (token, id) => {
    return http.get(`/rentals/${id}`, {
      headers: {
        Authorization: token,
      },
    });
  },
  post: (token, rental) => {
    return http.post('/rentals', rental, {
      headers: {
        Authorization: token,
      },
    });
  },
  put: (token, id, rental) => {
    return http.put(`/rentals/${id}`, rental, {
      headers: {
        Authorization: token,
      },
    });
  },
  delete: (token, id) => {
    return http.delete(`/rentals/${id}`, {
      headers: {
        Authorization: token,
      },
    });
  },
};
