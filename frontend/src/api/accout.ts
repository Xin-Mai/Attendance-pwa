import Api from './apis';
import axiosInstance from '/@/utils/axios/axios';

export const LoginApi = (params: { username: string, password: string, remember: boolean}) => axiosInstance.post(Api.LOGIN, params);