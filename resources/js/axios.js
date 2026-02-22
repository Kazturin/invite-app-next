import axios from "axios";
import store from "./store";
import router from "./router";

const axiosClient = axios.create({
    baseURL: `/api`
})

axiosClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${store.state.user.token}`
  return config;
})

axiosClient.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    sessionStorage.removeItem('TOKEN')
    router.push({name: 'Login'})
  } else if (error.response.status === 404) {
    router.push({name: 'NotFound'})
  } else if (error.response.status === 403) {
      router.push({name: 'Forbidden'})
  }
  //return error;
    return Promise.reject(error);
})

export default axiosClient;
