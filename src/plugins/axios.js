import axios from 'axios';

const http = axios.create({
  baseURL: 'https://bookstore-manager-app-api.herokuapp.com/api/v1',
  // baseURL: 'http://localhost:8080/api/v1',
});

export default http;
