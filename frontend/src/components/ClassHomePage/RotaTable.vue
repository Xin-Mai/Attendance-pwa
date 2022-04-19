<template>
  <a-table
    :columns="columns"
    :loading="loading"
    :pagination="false"
    row-key="uid"
    :data-source="dataSource"
  >
    <template #title>
      <a-button @click="showUploadModal">上传名册</a-button>
    </template>
  </a-table>
  <rota-modal
    :visible="modalVisible"
    :course="course"
    :class-name="className"
    :data-source="dataSource"
    @close="closeModal"
    @submit="newRotaSubmit"
  ></rota-modal>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import { ClassRotaApi } from '/@/api/course';
import { RotaResponseItem } from '/@/api/schema';
import type { TableColumnsType } from 'ant-design-vue';
import RotaModal from './RotaModal.vue';

export default defineComponent({
  name: 'RotaTable',
  components: { RotaModal },
  props: {
    course: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const loading: Ref<boolean> = ref(true);
    const dataSource: Ref<RotaResponseItem[]> = ref([]);
    const modalVisible: Ref<boolean> = ref(false);

    const columns: TableColumnsType = [
      {
        title: '学号',
        dataIndex: 'uid',
        key: 'uid',
        width: 100,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 60,
      },
    ];

    // 请求名册数据
    function getRota() {
      console.log('getRota');
      ClassRotaApi({ course: props.course, className: props.className }).then(
        (rota) => {
          dataSource.value = rota as unknown as RotaResponseItem[];
          loading.value = false;
          emit('update', dataSource.value.length);
        }
      );
    }

    getRota();

    const closeModal = () => {
      modalVisible.value = false;
    };

    return {
      loading,
      modalVisible,
      columns,
      dataSource,
      showUploadModal: () => {
        modalVisible.value = true;
      },
      closeModal,
      newRotaSubmit: () => {
        closeModal();
        getRota();
      },
    };
  },
});
</script>
