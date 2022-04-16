import Api from './apis';
import { AttendanceRequest } from './schema';
import axiosInstance from '/@/utils/axios/axios';

export const AttendApi = (params: AttendanceRequest) =>
  axiosInstance.post(Api.ATTEND, params);
