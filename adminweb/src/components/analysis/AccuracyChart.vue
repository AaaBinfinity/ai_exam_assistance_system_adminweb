<template>
  <div ref="chartRef" style="width: 100%; height: 400px;" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  data: { questionId: string; accuracy: number }[]
}

const props = defineProps<Props>()
const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const renderChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)

  chart.setOption({
    title: { text: '习题准确率' },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.questionId)
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '准确率',
        type: 'bar',
        data: props.data.map((item) => item.accuracy)
      }
    ]
  })
}

watch(
    () => props.data,
    () => {
      renderChart()
    },
    { deep: true }
)

onMounted(() => {
  renderChart()
})
</script>
