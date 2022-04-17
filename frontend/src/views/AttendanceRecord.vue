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
      row-key="uid"
    >
      <template #header>缺勤名单</template>
      <template #footer>共计{{ absentData.length }}人</template>
    </a-table>
    <a-table
      v-else-if="activeKey === 'present'"
      :columns="presentColumns"
      :data-source="presentData"
      row-key="uid"
    >
      <template #header>出勤名单</template>
      <template #footer>共计{{ presentData.length }}人</template>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import { AttendanceRecord } from '/@/api/schema';
import type { TableColumnsType } from 'ant-design-vue';

export default defineComponent({
  name: 'AttendanceRecord',
  setup() {
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
        width: 60,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 60,
      },
    ];
    const absentColumns: TableColumnsType = presentColumns.concat([
      {
        title: '原因',
        dataIndex: 'reason',
        key: 'reason',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'ps',
        key: 'ps',
      },
    ]);

    const absentData: Ref<AttendanceRecord[]> = ref([]);
    const presentData: Ref<AttendanceRecord[]> = ref([]);

    const onTabChange = (key: string) => {
      activeKey.value = key;
    };

    return {
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
