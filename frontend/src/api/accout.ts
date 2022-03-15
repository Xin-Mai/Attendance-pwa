import Api from './apis';
import axiosInstance from '/@/utils/axios/axios';

export const LoginApi = (params: { name: string, password: string}) => axiosInstance.post(Api.LOGIN, params);