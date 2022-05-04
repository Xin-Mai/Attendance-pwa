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
      <a-form-item label="上传图片">
        <pic-upload ref="picUpload" :img-url="imgUrl" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import type { SelectProps } from 'ant-design-vue';
import { defineComponent, reactive, UnwrapRef, ref, toRaw, watch } from 'vue';
import { AbsentForm, AbsentReason } from '/@/schemas';
import PicUpload from './PicUpload.vue';

export default defineComponent({
  name: 'AbsentModal',
  components: {
    PicUpload,
  },
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
    imgUrl: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'logAbsent'],
  setup(props, { emit }) {
    const picUpload: Ref<typeof picUpload | null> = ref(null);
    const formState: UnwrapRef<AbsentForm> = reactive({
      reason: props.reason,
      ps: props.ps,
      imgUrl: props.imgUrl,
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
        formState.reason = newVal.reason;
        formState.ps = newVal.ps;
      },
      { deep: true }
    );

    const handleOK = () => {
      const imgUrl: string = picUpload.value?.getPic() || '';
      formState.imgUrl = imgUrl;
      // 返回值的拷贝
      emit('logAbsent', { ...toRaw(formState) });
      picUpload.value?.clear();
    };

    return {
      picUpload,
      formState,
      options,
      handleOK,
    };
  },
});
</script>
