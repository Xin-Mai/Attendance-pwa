<template>
  <a-modal
    :visible="visible"
    title="考勤数据确认"
    style="border: 1px solid"
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
import { defineComponent, reactive, UnwrapRef, watchEffect } from 'vue';
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
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    // 初始化
    const dataSource: UnwrapRef<ConfirmData> = reactive({
      date: formatter(new Date(), 'yyyy年MM月dd日 hh:mm'),
      teacher: '陈长清',
      course: '摸鱼',
      present: 0,
      absent: 0,
      presentPercent: 0,
    });

    const handleOK = () => {
      console.log('confirm data');
      emit('confirm');
    };

    watchEffect(() => {
      dataSource.date = formatter(new Date(), 'yyyy年MM月dd日 hh:mm');
      dataSource.present = props.present;
      dataSource.absent = props.total - props.present;
      dataSource.presentPercent = Math.floor(
        (props.present * 100) / props.total
      );
    });

    return {
      dataSource,
      handleOK,
      ConfirmRow,
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
