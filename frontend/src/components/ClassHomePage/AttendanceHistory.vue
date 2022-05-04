<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'date'">
        <span>{{ ISOSformatter(record.date) }}</span>
      </template>
      <template v-if="column.key === 'action'">
        <a @click="toDetail(record)">查看</a>
      </template>
      <template v-else-if="column.key === 'presentPercent'">
        <span>{{ record.presentPercent * 100 }}%</span>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import { AttendanceRecord, AttendanceResponseInfo } from '/@/api/schema';
import type { TableColumnsType } from 'ant-design-vue';
import { useRouter, Router } from 'vue-router';
import { AttendHistoryApi } from '/@/api/attend';
import { ISOSformatter } from '/@/utils/util';

export default defineComponent({
  name: 'AttendanceHistory',
  props: {
    course: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router: Router = useRouter();

    const columns: TableColumnsType = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        sorter: (a: string, b: string) => a < b ? -1 : a == b ? 0 : 1 ,
      },
      {
        title: '出勤人数',
        dataIndex: 'present',
        key: 'present',
      },
      {
        title: '出勤率',
        dataIndex: 'presentPercent',
        key: 'presentPercent',
      },
      {
        title: '详情',
        key: 'action',
      },
    ];

    const dataSource: Ref<AttendanceResponseInfo[]> = ref([]);
    const loading: Ref<boolean> = ref(true);

    AttendHistoryApi({ course: props.course, className: props.className }).then(
      (val) => {
        dataSource.value = val as unknown as AttendanceResponseInfo[];
        loading.value = false;
      }
    );
    const toDetail = (record: AttendanceResponseInfo) => {
      router.push({
        name: 'attendanceRecord',
        params: {
          course: props.course,
          className: props.className,
          date: record.date,
        },
      });
    };

    return {
      columns,
      dataSource,
      loading,
      toDetail,
      ISOSformatter,
    };
  },
});
</script>
