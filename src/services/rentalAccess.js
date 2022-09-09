import http from '@/plugins/axios';

export default {
  getAll: () => {
    return http.get('/rentals', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTY2MzI3MDEzNiwiaWF0IjoxNjYyNjY1MzM2fQ.5rTru88N-Qwmnlh8Y7kUmJhfPBMAl8BG92vePgkD5aho3FWM4iPygAtUBzR90YaWa59bozVAYfPMu1ZtMDqIUw',
      },
    });
  },
  getById: (id) => {
    return http.get(`/rentals/${id}`, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTY2MzI3MDEzNiwiaWF0IjoxNjYyNjY1MzM2fQ.5rTru88N-Qwmnlh8Y7kUmJhfPBMAl8BG92vePgkD5aho3FWM4iPygAtUBzR90YaWa59bozVAYfPMu1ZtMDqIUw',
      },
    });
  },
  post: (rental) => {
    return http.post('/rentals', rental, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTY2MzI3MDEzNiwiaWF0IjoxNjYyNjY1MzM2fQ.5rTru88N-Qwmnlh8Y7kUmJhfPBMAl8BG92vePgkD5aho3FWM4iPygAtUBzR90YaWa59bozVAYfPMu1ZtMDqIUw',
      },
    });
  },
  put: (id, rental) => {
    return http.put(`/rentals/${id}`, rental, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTY2MzI3MDEzNiwiaWF0IjoxNjYyNjY1MzM2fQ.5rTru88N-Qwmnlh8Y7kUmJhfPBMAl8BG92vePgkD5aho3FWM4iPygAtUBzR90YaWa59bozVAYfPMu1ZtMDqIUw',
      },
    });
  },
  delete: (id) => {
    return http.delete(`/rentals/${id}`, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTY2MzI3MDEzNiwiaWF0IjoxNjYyNjY1MzM2fQ.5rTru88N-Qwmnlh8Y7kUmJhfPBMAl8BG92vePgkD5aho3FWM4iPygAtUBzR90YaWa59bozVAYfPMu1ZtMDqIUw',
      },
    });
  },
};
