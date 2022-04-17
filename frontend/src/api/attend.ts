import Api from './apis';
import {
  AttendanceRecordRequest,
  AttendanceRequest,
  ClassRequestParams,
} from './schema';
import axiosInstance from '/@/utils/axios/axios';

export const AttendApi = (params: AttendanceRequest) =>
  axiosInstance.post(Api.ATTEND_ADD, params);

export const AttendHistoryApi = (params: ClassRequestParams) =>
  axiosInstance.post(Api.ATTEND_HISTORY, params);

export const AttendRecordApi = (params: AttendanceRecordRequest) =>
  axiosInstance.post(Api.ATTEND_RECORD, params);
