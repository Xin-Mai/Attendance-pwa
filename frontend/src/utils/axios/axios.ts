import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { signOut } from '../redirect';

const apiUrl = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL as string)
  : '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json;charset=UTF-8;'
    'Content-Type': 'application/json',
  },
});

//请求拦截器
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // console.log('axios sending request', config);
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error: any) => {
    // 对响应错误做点什么
    console.log('get error', error.response, error.response.status);
    if (error.response && error.response.status) {
      const status: number = error.response.status;
      let errMessage: string | null = null;
      switch (status) {
        case 400:
          errMessage = '请求错误';
          break;
        case 401:
          signOut();
          errMessage = '没有权限';
          break;
        case 404:
          errMessage = '请求地址出错';
          break;
        case 408:
          errMessage = '请求超时';
          break;
        case 500:
          errMessage = '服务器内部错误!';
          break;
        case 501:
          errMessage = '服务未实现!';
          break;
        case 502:
          errMessage = '网关错误!';
          break;
        case 503:
          errMessage = '服务不可用!';
          break;
        case 504:
          errMessage = '网关超时!';
          break;
        case 505:
          errMessage = 'HTTP版本不受支持';
          break;
        default:
          errMessage = '请求失败';
      }
      message.warning(errMessage);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
