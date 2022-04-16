import { CourseItem } from '../schemas';
import Api from './apis';
import { ClassRequestParams, CourseRequestParams } from './schema';
import axiosInstance from '/@/utils/axios/axios';

export const CoursesListApi = () => axiosInstance.get(Api.COURSES_LIST);

export const CoursesAddApi = (params: CourseRequestParams) =>
  axiosInstance.post(Api.COURSES_ADD, params);

export const CoursesRemoveApi = (params: CourseRequestParams) =>
  axiosInstance.post(Api.COURSES_REMOVE, params);

export const CoursesUpdateApi = (params: {
  course: string;
  newVal: { course: string };
}) => axiosInstance.post(Api.COURSES_UPDATE, params);

export const ClassAddApi = (params: ClassRequestParams) =>
  axiosInstance.post(Api.CLASS_ADD, params);

export const ClassRemoveApi = (params: ClassRequestParams) =>
  axiosInstance.post(Api.CLASS_REMOVE, params);

export const ClassUpdateApi = (params: {
  course: string;
  className: string;
  newVal: { clssName: string };
}) => axiosInstance.post(Api.CLASS_UPDATE, params);

export const ClassRotaApi = (params: ClassRequestParams) =>
  axiosInstance.post(Api.CLASS_ROTA, params);
