<template>
  <a-modal
    :visible="visible"
    title="缺勤登记"
    @ok="handleOK"
    @cancel="$emit('close')"
  >
    <a-form :model="formState">
      <a-form-item label="姓名">
        <a-input :value="name" :disabled="true"></a-input>
      </a-form-item>
      <a-form-item label="缺勤原因">
        <a-select
          v-model:value="formState.reason"
          :options="options"
        ></a-select>
      </a-form-item>
      <a-form-item label="备注">
        <a-input v-model:value="formState.ps"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import type { SelectProps } from 'ant-design-vue';
import { defineComponent, reactive, UnwrapRef, ref, toRaw, watch } from 'vue';
import { AbsentForm, AbsentReason } from '../schemas';

export default defineComponent({
  name: 'AbsentModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    reason: {
      type: Number,
      default: AbsentReason.LEAVE,
    },
    ps: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'logAbsent'],
  setup(props, { emit }) {
    const formState: UnwrapRef<AbsentForm> = reactive({
      name: props.name,
      reason: props.reason,
      ps: props.ps,
    });

    const options = ref<SelectProps['options']>([
      {
        value: AbsentReason.LEAVE,
        label: '请假',
      },
      {
        value: AbsentReason.NO_REASON,
        label: '无故缺勤',
      },
      {
        value: AbsentReason.ELSE,
        label: '其他（见备注）',
      },
    ]);

    watch(
      () => props,
      (newVal, _) => {
        console.log('watch');
        formState.name = newVal.name;
        formState.reason = newVal.reason;
        formState.ps = newVal.ps;
      },
      { deep: true }
    );

    const handleOK = () => {
      console.log('ok');
      // 返回值的拷贝
      emit('logAbsent', { ...toRaw(formState) });
    };

    return {
      formState,
      options,
      handleOK,
    };
  },
});
</script>
