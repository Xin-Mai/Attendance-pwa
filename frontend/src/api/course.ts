import Api from './apis';
import axiosInstance from '/@/utils/axios/axios';

export const CoursesListApi = () => axiosInstance.get(Api.COURSES_LIST);
