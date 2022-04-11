<template>
  <common-header title="考勤" />
  <a-table
    :columns="columns"
    :row-selection="rowSelection"
    :data-source="data"
    :pagination="false"
    class="checkTable"
    :scroll="{ x: 400 }"
  >
    <template #title>考勤</template>
    <template #bodyCell="{ index, column, record }">
      <template v-if="column.key === 'status'">
        <label>
          {{ record.status ? '出勤' : '缺席' }}
        </label>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button
          type="link"
          :disabled="record.status"
          style="padding: 0"
          @click="showAbsentModal(index)"
        >
          缺席登记
        </a-button>
      </template>
    </template>
  </a-table>
  <common-footer :show="true">
    <a-button type="primary" @click="showDetail">确认</a-button>
  </common-footer>
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
import ConfirmModal from '../components/CheckList/ConfirmModal.vue';
import AbsentModal from '../components/CheckList/AbsentModal.vue';
import type { TableProps } from 'ant-design-vue';
import { AbsentForm, AbsentReason, columns, Row } from '../schemas';
import CommonFooter from '/@/components/common/Footer.vue';
import CommonHeader from '/@/components/common/Header.vue';

export default defineComponent({
  name: 'CheckList',
  components: { ConfirmModal, AbsentModal, CommonFooter, CommonHeader },
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
  setup() {
    const data: Row[] = [
      {
        key: 1,
        uid: 'U201817122',
        name: '麦晓欣',
        status: false,
      },
      {
        key: 2,
        uid: 'U201817121',
        name: '赵敏',
        status: false,
      },
      {
        key: 3,
        uid: 'U201817120',
        name: '张雨莹',
        status: false,
      },
    ];
    // ref
    const confirmModal: Ref<null | typeof ConfirmModal> = ref(null);
    // 出勤checkbox配置
    const selectedRowKeys = ref<number[]>([]);
    const rowSelection: TableProps['rowSelection'] = {
      fixed: true,
      columnTitle: '签到',
      onSelect: (record, selected) => {
        // data[record.key].status = selected;
        record.status = selected;
        statusChange(record.key - 1);
      },
      // 全选与取消全选应该在这里处理
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows
        );
      },
    };
    //确认弹窗
    const modalVisible: Ref<boolean> = ref(false);
    const presentCount: Ref<number> = ref(0);
    // 显示统计数据
    const showDetail = () => {
      if (confirmModal.value) {
        confirmModal.value.updateTime();
      }
      modalVisible.value = true;
    };
    //关闭确认弹窗
    const closeConfirmModal = () => {
      modalVisible.value = false;
    };
    // 确认提前本次全部考勤数据
    const confirmData = () => {
      fillData();
      console.log('check api');
      closeConfirmModal();
    };

    // 将没有选择缺勤原因的默认为请假
    function fillData() {
      for (const record of data) {
        if (record.status === undefined) {
          record.status = false;
        }
        if (!record.status && !record.absentDetail) {
          record.absentDetail = {
            name: record.name,
            reason: AbsentReason.LEAVE,
            ps: '',
          };
        }
      }
    }

    //缺勤弹窗
    const absentModalVisible: Ref<boolean> = ref(false);
    const curIndex: Ref<number> = ref(0);
    const absentInfo: UnwrapRef<AbsentForm> = reactive<AbsentForm>({
      name: '',
      reason: AbsentReason.LEAVE,
      ps: '',
    });

    // 当前操作对象的缺勤信息
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
      console.log('change', data[index].status);
      if (data[index].status) {
        data[index].absentDetail = null;
        presentCount.value += 1;
      } else {
        presentCount.value -= 1;
      }
    };

    watchEffect(() => {
      console.log(data[0].absentDetail);
    });

    return {
      rowSelection,
      columns,
      data,
      curIndex,
      modalVisible,
      presentCount,
      // 确认
      showDetail,
      closeConfirmModal,
      confirmData,
      // 缺勤对话框
      statusChange,
      absentInfo,
      absentModalVisible,
      showAbsentModal,
      logAbsent,
      closeAbsentModal,
      test: ref(false),
      confirmModal,
    };
  },
});
</script>

<style scoped>
.checkTable tr > td {
  min-width: 6rem;
}
.footer {
  z-index: 2;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 1rem;
  box-shadow: 0px -5px 5px #f0f0f0;
  text-align: right;
}
</style>
