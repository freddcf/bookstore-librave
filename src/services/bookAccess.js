import http from '@/plugins/axios';

export default {
  getAll: () => {
    return http.get('/books');
  },
  getById: (id) => {
    return http.get(`/books/${id}`);
  },
  post: (book) => {
    return http.post('/books', book);
  },
  put: (id, book) => {
    return http.put(`/books/${id}`, book);
  },
  delete: (id) => {
    return http.delete(`/books/${id}`);
  },
};
