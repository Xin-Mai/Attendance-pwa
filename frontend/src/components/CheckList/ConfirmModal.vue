<template>
  <a-modal
    :visible="visible"
    title="考勤数据确认"
    @ok="handleOK"
    @cancel="$emit('close')"
  >
    <table>
      <tr v-for="row in ConfirmRow" :key="row.key">
        <th class="tableLabel">{{ row.label }}</th>
        <td>
          {{ dataSource[row.key] }}
          <label v-if="row.key === 'present' || row.key === 'absent'">人</label>
          <label v-else-if="row.key === 'presentPercent'">%</label>
        </td>
      </tr>
    </table>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, UnwrapRef, watchEffect, watch } from 'vue';
import { ConfirmRow, ConfirmData } from '/@/schemas';
import { formatter } from '/@/utils/util';

export default defineComponent({
  name: 'ConfirmModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    present: {
      type: Number,
      default: 0,
    },
    className: {
      type: String,
      default: '',
    },
    course: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    // 初始化
    const dataSource: UnwrapRef<ConfirmData> = reactive({
      date: formatter(new Date(), 'yyyy年MM月dd日 hh:mm'),
      teacher: '陈长清',
      course: props.course,
      className: props.className,
      present: 0,
      absent: 0,
      presentPercent: 0,
    });

    const handleOK = () => {
      console.log('confirm data');
      emit('confirm');
    };

    const updateTime = () => {
      console.log('update');
      dataSource.date = formatter(new Date(), 'yyyy年MM月dd日 hh:mm');
    };

    watchEffect(() => {
      dataSource.className = props.className;
      dataSource.course = props.course;
      dataSource.present = props.present;
      dataSource.absent = props.total - props.present;
      dataSource.presentPercent = Math.floor(
        (props.present * 100) / props.total
      );
    });

    return {
      dataSource,
      ConfirmRow,
      handleOK,
      updateTime,
    };
  },
});
</script>

<style scoped>
.tableLabel {
  /**文字左对齐 */
  text-align: start;
  width: 4rem;
  min-width: 3rem;
}
</style>
