<template>
  <div>
    <div id="line-chart"></div>
    <div style="text-align: center">
      <span>共计考勤：{{ dataSource.length }} 次</span>
      <span style="margin-left: 15px"
        >平均出勤率：{{ (average * 100).toFixed(1) }}%</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  watch,
  Ref,
  ref,
} from 'vue';
import echarts from '/@/utils/echarts';
import type { ECharts } from 'echarts';
// import type { ECOption } from '/@/utils/echarts';
import { AttendanceResponseInfo } from '/@/api/schema';
import { AttendHistoryApi } from '/@/api/attend';
import { ISOSformatter } from '/@/utils/util';

export default defineComponent({
  name: 'StatisticalChart',
  props: {
    className: {
      type: String,
      default: '',
    },
    course: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    let lineChart: ECharts | null = null;
    const average: Ref<number> = ref(0);
    const dataSource: Ref<AttendanceResponseInfo[]> = ref([]);
    const options: {
      xAxis: object;
      yAxis: object;
      series: Array<Object>;
      dataset: {
        source: (number | string)[][];
      };
    } = {
      // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
      xAxis: { type: 'category' },
      // 声明一个 Y 轴，数值轴。
      yAxis: {},
      series: [{ type: 'line' }],
      dataset: {
        source: [],
      },
    };

    // 如果有参数则进行查询
    if (props.className && props.course) {
      AttendHistoryApi({
        course: props.course,
        className: props.className,
      }).then((val) => {
        dataSource.value = val as unknown as AttendanceResponseInfo[];
        // setOptions(dataSource.value);
      });
    }

    onMounted(() => {
      const dom: HTMLElement | null = document.getElementById('line-chart');
      if (dom) {
        lineChart = echarts.init(dom) as unknown as ECharts;
        console.log(lineChart);
        lineChart?.setOption(options);
      }
    });

    onBeforeUnmount(() => {
      console.log('unmounted');
      lineChart?.dispose();
    });

    // 对返回的数据进行filt并设置为options中的dataset.source
    function setOptions(data: AttendanceResponseInfo[]) {
      const product: string[] = ['product', '出勤率'];
      const filterOptions = [product, ...optionsFiter(data)];
      options.dataset.source = filterOptions;
      lineChart?.setOption(options);
    }

    function optionsFiter(
      data: AttendanceResponseInfo[]
    ): (string | number)[][] {
      const res: (string | number)[][] = [];
      for (const record of data) {
        res.push([ISOSformatter(record.date), record.presentPercent]);
      }
      return res;
    }

    watch(
      () => dataSource.value,
      (newVal) => {
        setOptions(newVal);
        average.value =
          newVal.reduce((val, cur) => val + parseFloat(cur.presentPercent), 0) /
          newVal.length;
      }
    );

    window.onresize = function () {
      lineChart?.resize();
    };

    return {
      dataSource,
      average,
    };
  },
});
</script>

<style scoped>
#line-chart {
  width: 100%;
  height: 400px;
}
</style>
