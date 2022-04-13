import { CourseItem } from '../schemas';
import Api from './apis';
import axiosInstance from '/@/utils/axios/axios';

export const CoursesListApi = () => axiosInstance.get(Api.COURSES_LIST);

export const CoursesAddApi = (params: { course: string }) =>
  axiosInstance.post(Api.COURSES_ADD, params);
