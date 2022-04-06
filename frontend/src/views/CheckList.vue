<template>
  <a-table :columns="columns" :data-source="data" :pagination="false">
    <template #title>考勤</template>
    <template #bodyCell="{ index, column, record }">
      <template v-if="column.key === 'status'">
        <label>
          {{ record.status ? '出勤' : '缺席' }}
        </label>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-checkbox
          v-model:checked="record.status"
          @change="statusChange(index)"
        >
          签到
        </a-checkbox>
        <a-button
          type="link"
          :disabled="record.status"
          @click="showAbsentModal(index)"
        >
          缺席登记
        </a-button>
      </template>
    </template>
  </a-table>
  <a-button type="primary" @click="showDetail">确认</a-button>
  <confirm-modal
    :visible="modalVisible"
    :present="presentCount"
    :total="data.length"
    @close="closeModal"
  />
  <absent-modal
    :visible="absentModalVisible"
    v-bind="absentInfo"
    @close="closeAbsentModal"
    @log-absent="logAbsent"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  Ref,
  UnwrapRef,
  watchEffect,
} from 'vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import AbsentModal from '../components/AbsentModal.vue';
import { AbsentForm, AbsentReason, columns, Row } from '../schemas';

export default defineComponent({
  name: 'CheckList',
  components: { ConfirmModal, AbsentModal },
  setup() {
    const data: Row[] = [
      {
        uid: 'U201817122',
        name: '麦晓欣',
        status: false,
      },
      {
        uid: 'U201817121',
        name: '赵敏',
        status: false,
      },
    ];
    //确认弹窗
    const modalVisible: Ref<boolean> = ref(false);
    const presentCount: Ref<number> = ref(0);
    const showDetail = () => {
      modalVisible.value = true;
    };

    //缺勤弹窗
    const absentModalVisible: Ref<boolean> = ref(false);
    const curIndex: Ref<number> = ref(0);
    const absentInfo: UnwrapRef<AbsentForm> = reactive<AbsentForm>({
      name: '',
      reason: AbsentReason.LEAVE,
      ps: '',
    });

    // 当前操作对象
    const showAbsentModal = (index: number) => {
      curIndex.value = index;
      console.log(index, data[index].absentDetail);
      absentInfo.name = data[index].name;
      absentInfo.reason =
        data[index].absentDetail?.reason || AbsentReason.LEAVE;
      absentInfo.ps = data[index].absentDetail?.ps || '';
      absentModalVisible.value = true;
    };

    // 更新缺勤信息
    const logAbsent = (formState: AbsentForm) => {
      data[curIndex.value].absentDetail = formState;
      closeAbsentModal();
    };
    const closeAbsentModal = () => {
      absentModalVisible.value = false;
    };

    // 缺勤变出勤需要清空缺勤信息
    const statusChange = (index: number) => {
      if (data[index].status) {
        data[index].absentDetail = null;
        presentCount.value += 1;
      }
    };

    watchEffect(() => {
      console.log(data[0].absentDetail);
    });

    return {
      columns,
      data,
      curIndex,
      modalVisible,
      presentCount,
      showDetail,
      closeModal: () => {
        modalVisible.value = false;
      },
      statusChange,
      absentInfo,
      absentModalVisible,
      showAbsentModal,
      logAbsent,
      closeAbsentModal,
    };
  },
});
</script>
