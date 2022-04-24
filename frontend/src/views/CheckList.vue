<template>
  <common-header title="考勤" />
  <check-table
    :course="course"
    :class-name="className"
    @submit="submitCheckList"
  ></check-table>
  <confirm-modal
    ref="confirmModal"
    :visible="modalVisible"
    :present="presentCount"
    :total="data.length"
    :class-name="className"
    :course="course"
    @confirm="confirmData"
    @close="closeConfirmModal"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, UnwrapRef, computed } from 'vue';
import CommonHeader from '/@/components/common/Header.vue';
import CheckTable from '/@/components/CheckList/CheckTable.vue';
import ConfirmModal from '/@/components/CheckList/ConfirmModal.vue';

import { AttendApi } from '/@/api/attend';

import { AbsentForm, AbsentReason, Row } from '/@/schemas';
import { Router, useRouter } from 'vue-router';

export default defineComponent({
  name: 'CheckList',
  components: { CheckTable, CommonHeader, ConfirmModal },
  props: {
    className: {
      type: String,
      default: '',
    },
    course: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    //确认弹窗
    const confirmModal: Ref<null | typeof ConfirmModal> = ref(null);
    const modalVisible: Ref<boolean> = ref(false);
    const data: Ref<Row[]> = ref([]);

    const router: Router = useRouter();

    const submitCheckList = (records: Row[]) => {
      console.log('get emit', records);
      data.value = records;
      if (confirmModal.value) {
        confirmModal.value.updateTime();
      }
      modalVisible.value = true;
    };

    const total = computed(() => data.value.length);

    const presentCount = computed(() =>
      data.value.reduce((val, cur) => (cur.status ? val + 1 : val), 0)
    );
    // 确认提前本次全部考勤数据
    const confirmData = async () => {
      // fillData();
      console.log('check api');
      await AttendApi({
        course: props.course,
        className: props.className,
        records: data.value,
      });
      modalVisible.value = false;
      router.push({
        name: 'classHomePage',
        params: {
          course: props.course,
          className: props.className,
        },
      });
    };

    return {
      data,
      modalVisible,
      total,
      presentCount,
      submitCheckList,
      closeConfirmModal: () => {
        modalVisible.value = false;
      },
      confirmData,
    };
  },
});
</script>
