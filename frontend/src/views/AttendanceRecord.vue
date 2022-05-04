<template>
  <common-header title="考勤记录" :backable="true"></common-header>
  <a-card :title="`${className} ${course} ${ISOSformatter(date)}考勤记录`">
    <template #extra>
      <a-switch
        v-model:checked="isModified"
        checked-children="修改"
        un-checked-children="取消"
      />
    </template>
    <keep-alive>
      <div>
        <check-table
          v-if="isModified"
          :course="course"
          :class-name="className"
          :rota="dataSource"
          :is-history="true"
          @submit="submitModify"
        ></check-table>
        <div v-else>
          <a-table
            :columns="absentColumns"
            :data-source="absentData"
            :scroll="{ x: true }"
            row-key="uid"
            :pagination="false"
            :locale="{ emptyText: '无人缺勤' }"
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'status'">缺勤</span>
              <span v-else-if="column.key === 'reason'">
                {{ ReasonArray[record.absentDetail.reason] }}
              </span>
              <div v-else-if="column.key === 'imgUrl'">
                <a-image
                  v-if="record.absentDetail.imgUrl !== ''"
                  :src="record.absentDetail.imgUrl"
                  style="height: 2rem"
                />
              </div>
            </template>
            <template #footer>共计缺勤 {{ absentData.length }} 人</template>
          </a-table>
          <a-table
            :columns="presentColumns"
            :data-source="presentData"
            row-key="uid"
            :pagination="false"
            style="margin-top: 1rem"
            :locale="{ emptyText: '无人出勤' }"
          >
            <template #bodyCell="{ column }">
              <span v-if="column.key === 'status'">出勤</span>
            </template>
            <template #footer>共计出勤 {{ presentData.length }} 人</template>
          </a-table>
        </div>
      </div>
    </keep-alive>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

import CheckTable from '/@/components/CheckList/CheckTable.vue';
import CommonHeader from '/@/components/common/Header.vue';
import CommonFooter from '/@/components/common/Footer.vue';
import { Modal } from 'ant-design-vue';

import { AttendanceRecord } from '/@/api/schema';
import type { TableColumnsType } from 'ant-design-vue';
import { AttendModifyApi, AttendRecordApi } from '../api/attend';
import { ReasonArray, Row } from '/@/schemas';

import { ISOSformatter } from '/@/utils/util';

export default defineComponent({
  name: 'AttendanceRecord',
  components: {
    CheckTable,
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
    const isModified: Ref<boolean> = ref(false);
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
      {
        title: '图片',
        dataIndex: ['absentDetail', 'imgUrl'],
        key: 'imgUrl',
        width: 100,
      },
    ]);

    const dataSource: Ref<AttendanceRecord[]> = ref([]);
    const absentData: Ref<AttendanceRecord[]> = ref([]);
    const presentData: Ref<AttendanceRecord[]> = ref([]);

    const getData = () => {
      const { course, className, date } = props;
      AttendRecordApi({ course, className, date }).then((val) => {
        const data = val as unknown as AttendanceRecord[];
        dataSource.value = data;
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

    const submitModify = (records: AttendanceRecord[]) => {
      console.log(records);
      Modal.confirm({
        title: '确定修改签到历史记录吗?',
        content: '修改后的记录将覆盖原记录',
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          try {
            await modifyHistory(records);
            isModified.value = false;
            getData();
          } catch (e) {
            console.log(e);
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };

    async function modifyHistory(records) {
      await AttendModifyApi({
        course: props.course,
        className: props.className,
        date: props.date,
        records,
      });
    }

    return {
      ISOSformatter,
      ReasonArray,
      tabList,
      presentColumns,
      absentColumns,
      dataSource,
      absentData,
      presentData,
      activeKey,
      onTabChange,
      isModified,
      setModified: (val: boolean) => {
        isModified.value = val;
      },
      submitModify,
    };
  },
});
</script>

<style scoped></style>
