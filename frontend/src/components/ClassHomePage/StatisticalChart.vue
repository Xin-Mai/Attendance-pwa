<template>
  <div>
    统计表格
    <div id="line-chart"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, Ref, ref } from 'vue';
import Echarts from '/@/utils/echarts';
import type { ECOption } from '/@/utils/echarts';
import type { EChartsType } from 'echarts';
import { AttendanceResponseInfo } from '/@/api/schema';
import { AttendHistoryApi } from '/@/api/attend';

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
    let lineChart: EChartsType | null = null;
    const dataSource: Ref<AttendanceResponseInfo[]> = ref([]);
    const options: ECOption = {
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
        lineChart = Echarts.init(dom);
        console.log(lineChart);
        lineChart?.setOption(options);
      }
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
        res.push([record.date, record.presentPercent]);
      }
      return res;
    }

    watch(
      () => dataSource.value,
      (newVal) => {
        console.log(newVal);
        setOptions(newVal);
      }
    );

    window.onresize = function () {
      lineChart?.resize();
    };

    return {
      options,
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
