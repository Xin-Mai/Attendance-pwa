import type { TableColumnsType } from 'ant-design-vue';
export const columns: TableColumnsType = [
  {
    title: '学号',
    dataIndex: 'uid',
    key: 'uid',
    width: 100,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 60,
  },
  {
    title: '出勤状态',
    dataIndex: 'status',
    key: 'status',
    width: 50,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 80,
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
    label: '班级',
    key: 'className',
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

export interface CourseItem {
  course: string;
  classes: string[];
}

// 使用签名索引表达数组
export interface CoursesList {
  [index: number]: CourseItem;
}

export interface ConfirmData {
  date: string;
  teacher: string;
  course: string;
  className: string;
  present: number;
  absent: number;
  presentPercent: number;
}

export interface AbsentForm {
  reason: AbsentReason;
  ps: string;
}

export interface Row {
  key?: string | number;
  uid: string;
  name: string;
  status: boolean;
  absentDetail?: AbsentForm;
}

export enum AbsentReason {
  LEAVE = 0,
  NO_REASON = 1,
  ELSE = 2,
}

export const ReasonArray: string[] = ['请假', '无故缺勤', '其他'];
