<template>
  <common-header title="考勤记录" :backable="true"></common-header>
  <a-card
    :tab-list="tabList"
    :active-tab-key="activeKey"
    @tab-change="onTabChange"
  >
    <a-table
      v-if="activeKey === 'absent'"
      :columns="absentColumns"
      :data-source="absentData"
      :scroll="{ x: true }"
      row-key="uid"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <span v-if="column.key === 'status'">缺勤</span>
        <span v-else-if="column.key === 'reason'">
          {{ ReasonArray[record.absentDetail.reason] }}
        </span>
      </template>
      <template #footer>共计缺勤 {{ absentData.length }} 人</template>
    </a-table>
    <a-table
      v-else-if="activeKey === 'present'"
      :columns="presentColumns"
      :data-source="presentData"
      row-key="uid"
      :pagination="false"
    >
      <template #bodyCell="{ column }">
        <span v-if="column.key === 'status'">出勤</span>
      </template>
      <template #footer>共计出勤 {{ presentData.length }} 人</template>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import CommonHeader from '/@/components/common/Header.vue';
import { AttendanceRecord } from '/@/api/schema';
import type { TableColumnsType } from 'ant-design-vue';
import { AttendRecordApi } from '../api/attend';
import { ReasonArray } from '/@/schemas';

export default defineComponent({
  name: 'AttendanceRecord',
  components: {
    CommonHeader,
  },
  props: {
    course: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const activeKey: Ref<string> = ref('absent');

    const tabList = [
      {
        key: 'absent',
        tab: '缺勤',
      },
      {
        key: 'present',
        tab: '出勤',
      },
    ];
    const presentColumns: TableColumnsType = [
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
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
      },
    ];
    const absentColumns: TableColumnsType = presentColumns.concat([
      {
        title: '原因',
        dataIndex: ['absentDetail', 'reason'],
        key: 'reason',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: ['absentDetail', 'ps'],
        key: 'ps',
        width: 100,
      },
    ]);

    const absentData: Ref<AttendanceRecord[]> = ref([]);
    const presentData: Ref<AttendanceRecord[]> = ref([]);

    const getData = () => {
      const { course, className, date } = props;
      AttendRecordApi({ course, className, date }).then((val) => {
        const data = val as unknown as AttendanceRecord[];
        filtData(data);
      });
    };

    const filtData = (data: AttendanceRecord[]) => {
      const absent: AttendanceRecord[] = [];
      const present: AttendanceRecord[] = [];
      for (const record of data) {
        if (record.status) {
          present.push(record);
        } else {
          absent.push(record);
        }
      }
      absentData.value = absent;
      presentData.value = present;
    };

    getData();
    const onTabChange = (key: string) => {
      activeKey.value = key;
    };

    return {
      ReasonArray,
      tabList,
      presentColumns,
      absentColumns,
      absentData,
      presentData,
      activeKey,
      onTabChange,
    };
  },
});
</script>

<style scoped></style>
