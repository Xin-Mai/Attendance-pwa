import { AbsentForm } from '../schemas';

export interface CourseListResponseItem {
  course: string;
  classes: string[];
}

export interface CourseRequestParams {
  course: string;
}

export interface ClassRequestParams {
  course: string;
  className: string;
}

export interface RotaResponseItem {
  uid: string;
  name: string;
}

export interface AttendanceRecord {
  uid: string;
  name: string;
  status: boolean;
  absentDetail?: AbsentForm;
}

export interface AttendanceRequest {
  course: string;
  className: string;
  records: AttendanceRecord[];
}

export interface AttendanceModifyRequest {
  course: string;
  className: string;
  date: string;
  records: AttendanceRecord[];
}

export interface AttendanceResponseInfo {
  date: string;
  present: number;
  presentPercent: string;
}

export interface AttendanceRecordRequest {
  course: string;
  className: string;
  date: string;
}

export interface RotaSetParams {
  course: string;
  className: string;
  rota: RotaResponseItem[];
}
