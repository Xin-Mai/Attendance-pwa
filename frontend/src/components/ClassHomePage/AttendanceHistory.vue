<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a @click="toDetail(record)">点击查看</a>
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
        name: 'attendaceRecord',
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
    };
  },
});
</script>
