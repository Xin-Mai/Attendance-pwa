<template>
  <a-table
    :columns="columns"
    :loading="loading"
    :pagination="false"
    row-key="uid"
    :data-source="dataSource"
  ></a-table>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import { ClassRotaApi } from '/@/api/course';
import { RotaResponseItem } from '/@/api/schema';
import type { TableColumnsType } from 'ant-design-vue';

export default defineComponent({
  name: 'RotaTable',
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
  setup(props) {
    const loading: Ref<boolean> = ref(true);
    const dataSource: Ref<RotaResponseItem[]> = ref([]);

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
    ClassRotaApi({ course: props.course, className: props.className }).then(
      (rota) => {
        dataSource.value = rota as unknown as RotaResponseItem[];
        loading.value = false;
      }
    );

    return {
      loading,
      columns,
      dataSource,
    };
  },
});
</script>
