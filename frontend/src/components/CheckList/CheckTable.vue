<template>
  <a-table
    :columns="columns"
    :row-selection="rowSelection"
    :data-source="data"
    :pagination="false"
    class="checkTable"
    :scroll="{ x: 400 }"
  >
    <!--<template #title>考勤</template>-->
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
    <a-button type="primary" @click="submitData">确认</a-button>
  </common-footer>
  <absent-modal
    :visible="absentModalVisible"
    :name="absentName"
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
  watch,
  toRaw,
} from 'vue';
import AbsentModal from './AbsentModal.vue';
import type { TableProps } from 'ant-design-vue';
import { AbsentForm, AbsentReason, columns, Row } from '/@/schemas';
import CommonFooter from '/@/components/common/Footer.vue';
import { AttendanceRecord, RotaResponseItem } from '/@/api/schema';
import { ClassRotaApi } from '/@/api/course';
import { Key } from 'ant-design-vue/lib/_util/type';

export default defineComponent({
  name: 'CheckTable',
  components: { AbsentModal, CommonFooter },
  props: {
    className: {
      type: String,
      default: '',
    },
    course: {
      type: String,
      default: '',
    },
    isHistory: {
      type: Boolean,
      default: false,
    },
    rota: {
      type: Array,
      default: () => new Array<RotaResponseItem>(),
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const rota: Ref<RotaResponseItem[]> = ref([]);
    const data: Ref<Row[]> = ref([]);

    function getRota() {
      ClassRotaApi({ course: props.course, className: props.className }).then(
        (val) => {
          rota.value = val as unknown as RotaResponseItem[];
        }
      );
    }
    const selectedRowKeys: Ref<Key[]> = ref([]);
    if (!props.isHistory) {
      getRota();
    } else {
      const dataSource: Row[] = [];
      const rota: AttendanceRecord[] = props.rota as AttendanceRecord[];
      for (let i = 0; i < rota.length; i++) {
        dataSource.push({
          key: i,
          ...rota[i],
        });
        if (rota[i].status) {
          selectedRowKeys.value.push(i);
        }
      }
      data.value = dataSource;
    }

    watch(
      () => rota.value,
      (newVal, _) => {
        console.log(newVal);
        const dataSource: Row[] = [];
        for (let i = 0; i < newVal.length; i++) {
          dataSource.push({
            key: i,
            status: false,
            ...newVal[i],
          });
        }
        data.value = dataSource;
      }
    );
    // const data: Row[] = [
    //   {
    //     key: 1,
    //     uid: 'U201817122',
    //     name: '麦晓欣',
    //     status: false,
    //   },
    //   {
    //     key: 2,
    //     uid: 'U201817121',
    //     name: '赵敏',
    //     status: false,
    //   },
    //   {
    //     key: 3,
    //     uid: 'U201817120',
    //     name: '张雨莹',
    //     status: false,
    //   },
    // ];

    // 出勤checkbox配置
    const rowSelection: TableProps['rowSelection'] = {
      fixed: true,
      columnTitle: '签到',
      onSelect: (record, selected) => {
        // data.value[record.key].status = selected;
        record.status = selected;
        statusChange(record.key);
      },
      selectedRowKeys,
      // 全选与取消全选应该在这里处理
      onChange: (newSelectedRowKeys) => {
        selectedRowKeys.value = newSelectedRowKeys;
        // console.log(
        //   `selectedRowKeys: ${newSelectedRowKeys}`,
        //   'selectedRows: ',
        //   selectedRows
        // );
      },
    };

    function getRawData(): Row[] {
      fillData();
      return toRaw(data.value);
    }

    const submitData = () => {
      emit('submit', getRawData());
    };

    // 将没有选择缺勤原因的默认为请假
    function fillData() {
      for (const record of data.value) {
        if (record.status === undefined) {
          record.status = false;
        }
        if (!record.status && !record.absentDetail) {
          record.absentDetail = {
            // name: record.name,
            reason: AbsentReason.LEAVE,
            ps: '',
          };
        }
      }
    }

    //缺勤弹窗
    const absentModalVisible: Ref<boolean> = ref(false);
    const curIndex: Ref<number> = ref(0);
    const absentName: Ref<string> = ref('');
    const absentInfo: UnwrapRef<AbsentForm> = reactive<AbsentForm>({
      reason: AbsentReason.LEAVE,
      ps: '',
    });

    // 当前操作对象的缺勤信息
    const showAbsentModal = (index: number) => {
      curIndex.value = index;
      console.log(index, data.value[index].absentDetail);
      absentName.value = data.value[index].name;
      absentInfo.reason =
        data.value[index].absentDetail?.reason || AbsentReason.LEAVE;
      absentInfo.ps = data.value[index].absentDetail?.ps || '';
      absentModalVisible.value = true;
    };

    // 更新缺勤信息
    const logAbsent = (formState: AbsentForm) => {
      data.value[curIndex.value].absentDetail = {
        reason: formState.reason,
        ps: formState.ps,
      };
      closeAbsentModal();
    };
    const closeAbsentModal = () => {
      absentModalVisible.value = false;
    };

    // 缺勤变出勤需要清空缺勤信息
    const statusChange = (index: number) => {
      console.log('change', data.value[index].status);
      if (data.value[index].status) {
        data.value[index].absentDetail = undefined;
      }
    };

    return {
      rowSelection,
      columns,
      data,
      curIndex,
      // 确认
      getRawData,
      submitData,
      // 缺勤对话框
      statusChange,
      absentName,
      absentInfo,
      absentModalVisible,
      showAbsentModal,
      logAbsent,
      closeAbsentModal,
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
