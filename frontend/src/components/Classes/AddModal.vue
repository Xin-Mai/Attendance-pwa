<template>
  <a-modal
    :visible="visible"
    :title="title"
    :confirm-loading="confirmLoading"
    ok-text="确认"
    cancel-text="取消"
    @ok="handleOK"
    @cancel="handleCancel"
  >
    <a-input
      v-model:value="inputModel"
      show-count
      :maxlength="20"
      @press-enter="handleOK"
    />
    <label v-show="addFailed" style="color: red">{{ failedMessage }}</label>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';

export default defineComponent({
  name: 'AddModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Simple Modal',
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'close'],
  setup(_, { emit }) {
    const inputModel: Ref<string> = ref('');
    const addFailed: Ref<boolean> = ref(false);
    const failedMessage: Ref<string> = ref('请重新检查输入内容');

    const handleOK = () => {
      emit('submit', inputModel.value);
    };

    const handleCancel = () => {
      emit('close');
      clear();
    };

    const showFailedMessage = (message: string = '请重新检查输入内容') => {
      addFailed.value = true;
      failedMessage.value = message;
    };

    const clear = () => {
      inputModel.value = '';
      addFailed.value = false;
    };

    return {
      inputModel,
      addFailed,
      failedMessage,
      handleOK,
      handleCancel,
      clear,
      showFailedMessage,
    };
  },
});
</script>
