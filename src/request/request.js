import axios from 'axios';
// import {Loading} from 'element-ui';

const service = axios.create({
  baseURL: 'http://localhost:3000',
  // baseURL: 'http://www.pinlepinle.com:3000',
  withCredentials: true,
  timeout: 5000,
  
}) 

service.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    return Promise.reject(err)
  }
)


export default service