import http from '@/plugins/axios';

export default {
  getAll: () => {
    return http.get('/publishers');
  },
  getById: (id) => {
    return http.get(`/publishers/${id}`);
  },
  post: (publisher) => {
    return http.post('/publishers', publisher);
  },
  put: (id, publisher) => {
    return http.put(`/publishers/${id}`, publisher);
  },
  delete: (id) => {
    return http.delete(`/publishers/${id}`);
  },
};
