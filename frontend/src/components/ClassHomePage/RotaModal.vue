<template>
  <a-modal
    :visible="visible"
    title="上传名册"
    ok-text="确认"
    cancel-text="取消"
    :confirm-loading="confirmLoading"
    width="100%"
    wrap-class-name="full-modal"
    @ok="handleOK"
    @cancel="handleCancel"
  >
    <div class="container">
      <p style="margin-bottom: 1rem">注意：输入的名册将覆盖原有的名册</p>
      <a-textarea
        v-model:value="rotaValue"
        placeholder="请按如下格式输入
        学号 姓名;
        U201817121 张三;
        U201817122 李四;"
        style="height: calc(65vh)"
      />
      <p class="message" :style="failed ? '' : 'visibility: hidden'">
        {{ failedMessage }}
      </p>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue';
import { RotaResponseItem } from '/@/api/schema';
import { RotaSetApi } from '/@/api/course';

export default defineComponent({
  name: 'RotaModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    course: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    dataSource: {
      type: Array,
      required: true,
    },
  },
  emits: ['submit', 'close'],
  setup(props, { emit }) {
    const confirmLoading: Ref<boolean> = ref(false);
    const rotaValue: Ref<string> = ref('');
    const defaultValue: Ref<string> = ref('');
    const failed: Ref<boolean> = ref(false);
    const failedMessage: Ref<string> = ref('');

    function setDefaultVal() {
      if (!props.dataSource) return;
      const temp: string[] = [];
      for (const student of props.dataSource as RotaResponseItem[]) {
        temp.push(`${student.uid},${student.name}`);
      }
      defaultValue.value = temp.join('\n');
      rotaValue.value = defaultValue.value;
    }

    watch(
      () => props.dataSource,
      () => {
        setDefaultVal();
      },
      {
        immediate: true,
      }
    );

    const handleOK = async () => {
      confirmLoading.value = true;
      try {
        const rota: RotaResponseItem[] = getRotaParams();
        await RotaSetApi({
          course: props.course,
          className: props.className,
          rota,
        });
        failed.value = false;
        emit('sbumit');
      } catch (err) {
        failed.value = true;
        failedMessage.value = err;
      }
      confirmLoading.value = false;
      // emit('close');
    };

    function getRotaParams(): RotaResponseItem[] {
      const rota: RotaResponseItem[] = [];
      const uids: string[] = [];
      const names: string[] = [];
      if (rotaValue.value.indexOf('，') > -1) {
        rotaValue.value = rotaValue.value.replaceAll('，', ',');
      }
      const records: string[] = rotaValue.value.split('\n');
      for (const record of records) {
        const student: string[] = record.split(',');
        if (student.length === 1 && student[0] === '') continue;
        if (student.length > 2)
          throw '请一行输入一个学号与姓名，请检查逗号数量是否为1';
        if (student[0] === '') throw '学号不能为空，请检查';
        if (student[1] === '') throw '学生姓名不能为空，请检查';
        uids.push(student[0].trim());
        names.push(student[1].trim());
      }
      if (Array.from(new Set(uids)).length < uids.length) {
        throw '学号只能唯一，请检查是否重复！';
      }
      if (uids.length !== names.length) throw '学号数量必需与姓名匹配';
      for (let i = 0; i < uids.length; i++) {
        rota.push({
          uid: uids[i],
          name: names[i],
        });
      }
      return rota;
    }

    const handleCancel = () => {
      emit('close');
      failed.value = false;
      rotaValue.value = defaultValue.value;
    };

    return {
      confirmLoading,
      rotaValue,
      defaultValue,
      failed,
      failedMessage,
      handleOK,
      handleCancel,
    };
  },
});
</script>

<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }

  .ant-modal-body {
    .container {
      position: absolute;
      width: 100%;
      padding: 24px;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }

  .message {
    margin-top: 1rem;
    color: red;
  }
}
</style>
