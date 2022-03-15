import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

let apiUrl= import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL as string : '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers:{
    'Content-Type': 'application/json;charset=UTF-8;'
  },
});

//请求拦截器
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    console.log('axios sending request', config);
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
)

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response;
  }, 
  (error: any) => {
    // 对响应错误做点什么
		console.log(error);
    if (error.response && error.response.status) {
      const status: number = error.response.status;
      let message: string | null = null;
      switch(status) {
        case 400:
	            message = '请求错误';
	            break;
	        case 401:
	            message = '请求错误';
	            break;
	        case 404:
	            message = '请求地址出错';
	            break;
	        case 408:
	            message = '请求超时';
	            break;
	        case 500:
	            message = '服务器内部错误!';
	            break;
	        case 501:
	            message = '服务未实现!';
	            break;
	        case 502:
	            message = '网关错误!';
	            break;
	        case 503:
	            message = '服务不可用!';
	            break;
	        case 504:
	            message = '网关超时!';
	            break;
	        case 505:
	            message = 'HTTP版本不受支持';
	            break;
	        default:
	            message = '请求失败';
              console.log(message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;