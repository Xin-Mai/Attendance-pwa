<template>
  <a-modal
    :visible="visible"
    title="考勤数据确认"
    @ok="handleOK"
    @cancel="$emit('close')"
  >
    <label>日期</label>
    <template v-for="row in ConfirmRow" :key="row.key">
      <label>{{ row.label }}</label>
      <p>{{ dataSource[row.key] }}</p>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, UnwrapRef, watchEffect } from 'vue';
import { ConfirmRow, ConfirmData } from '../schemas';
import { formatter } from '../utils/util';

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
  emits: ['close'],
  setup(props, { emit }) {
    // 初始化
    const dataSource: UnwrapRef<ConfirmData> = reactive({
      date: formatter(new Date(), 'yyyy年MM月dd日 hh:mm'),
      teacher: '',
      course: '摸鱼',
      present: 0,
      absent: 0,
      presentPercent: 0,
    });

    const handleOK = () => {
      console.log('ok');
      emit('close');
    };

    watchEffect(() => {
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
