export const columns = [
  {
    title: '学号',
    dataIndex: 'uid',
    key: 'uid',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '出勤状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
  },
];

export const ConfirmRow = [
  {
    label: '日期',
    key: 'date',
  },
  {
    label: '老师',
    key: 'teacher',
  },
  {
    label: '课程',
    key: 'course',
  },
  {
    label: '出勤',
    key: 'present',
  },
  {
    label: '缺勤',
    key: 'absent',
  },
  {
    label: '出勤率',
    key: 'presentPercent',
  },
];

export interface ConfirmData {
  date: string;
  teacher: string;
  course: string;
  present: number;
  absent: number;
  presentPercent: number;
}

export interface AbsentForm {
  name: string;
  reason: number;
  ps: string;
}

export interface Row {
  uid: string;
  name: string;
  status?: boolean;
  absentDetail?: AbsentForm | null;
}

export enum AbsentReason {
  LEAVE = 0,
  NO_REASON = 1,
  ELSE = 2,
}