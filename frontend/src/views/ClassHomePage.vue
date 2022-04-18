<template>
  <common-header title="班级" :backable="true"></common-header>
  <div class="container">
    <a-card class="header">
      <h1 class="header-text">{{ className }}班</h1>
      <div>
        <label>{{ course }}</label>
        <label style="margin-left: 10px">{{ count }}人</label>
      </div>
    </a-card>
    <a-card
      class="tabCard"
      :tab-list="tabList"
      :active-tab-key="activeKey"
      @tab-change="onTabChange"
    >
      <keep-alive>
        <a-card-grid
          v-if="activeKey === 'check'"
          style="text-align: center"
          @click="toCheck"
        >
          <CarryOutOutlined />
          考勤
        </a-card-grid>
        <rota-table
          v-else-if="activeKey === 'rota'"
          :course="course"
          :class-name="className"
        />
        <attendance-history
          v-else-if="activeKey === 'history'"
          :course="course"
          :class-name="className"
        />
        <statistical-chart v-else :course="course" :class-name="className" />
      </keep-alive>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { Router, useRouter } from 'vue-router';

import { ClassRotaApi } from '/@/api/course';
import { RotaResponseItem } from '/@/api/schema';

import { CarryOutOutlined } from '@ant-design/icons-vue';
import CommonHeader from '/@/components/common/Header.vue';
import RotaTable from '/@/components/ClassHomePage/RotaTable.vue';
import AttendanceHistory from '/@/components/ClassHomePage/AttendanceHistory.vue';
import StatisticalChart from '/@/components/ClassHomePage/StatisticalChart.vue';
import Store from '/@/store/store';

export default defineComponent({
  name: 'ClassHomePage',
  components: {
    CarryOutOutlined,
    CommonHeader,
    RotaTable,
    AttendanceHistory,
    StatisticalChart,
  },
  props: {
    className: {
      type: String,
      default: '1806',
    },
    course: {
      type: String,
      default: '软件工程',
    },
  },
  setup(props) {
    const router: Router = useRouter();
    const count: Ref<number> = ref(0);

    const activeKey: Ref<string> = ref('check');
    const tabList = [
      {
        key: 'check',
        tab: '考勤',
      },
      {
        key: 'rota',
        tab: '名册',
      },
      {
        key: 'echart',
        tab: '统计',
      },
      {
        key: 'history',
        tab: '考勤记录',
      },
    ];

    // 请求名册数据
    ClassRotaApi({ course: props.course, className: props.className }).then(
      (rota) => {
        count.value = (rota as unknown as RotaResponseItem[]).length;
      }
    );

    const onTabChange = (key: string) => {
      activeKey.value = key;
      console.log(key);
    };

    const toCheck = () => {
      router.push({
        name: 'check',
        params: {
          course: props.course,
          className: props.className,
        },
      });
    };

    return {
      name: Store.state.username,
      count,
      tabList,
      activeKey,
      onTabChange,
      toCheck,
    };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  height: auto;
  min-height: 100%;
  padding: 1rem;
  background-color: #eeeeee;
  display: flex;
  justify-content: start;
  flex-direction: column;
}

.header {
  flex: none;
}

.header .header-text {
  font-size: 1.125rem;
  line-height: 1.75rem;
  display: inline-block;
}

.header .header-button {
  float: right;
}

.tabCard {
  flex: auto;
}
</style>
