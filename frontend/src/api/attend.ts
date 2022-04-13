import Api from './apis';
import axiosInstance from '/@/utils/axios/axios';

export const AttendApi = (params) => axiosInstance.post(Api.ATTEND, params);
