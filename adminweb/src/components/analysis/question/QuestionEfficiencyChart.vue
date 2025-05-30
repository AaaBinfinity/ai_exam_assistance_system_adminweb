<template>
  <el-card shadow="hover" class="chart-card">
    <div ref="chartRef" class="chart"></div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { QuestionAnalysisApi } from '@/api/analysis/question'

export default defineComponent({
  name: 'QuestionEfficiencyChart',
  props: {
    subject: {
      type: String,
      default: ''
    },
    questionType: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const chartRef = ref<HTMLElement | null>(null)
    let chartInstance: echarts.ECharts | null = null

    // 初始化图表
    const initChart = () => {
      if (!chartRef.value) return

      chartInstance = echarts.init(chartRef.value)

      const option = {
        title: { text: '题目作答效率TOP10' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: { type: 'value', name: '效率' },
        yAxis: { type: 'category', data: [] },
        series: [{
          type: 'bar',
          data: [],
          itemStyle: {
            color: function(params: any) {
              const colorList = [
                '#9E87FF', '#73DDFF', '#FE9F8B', '#F56948', '#F9BB3C',
                '#BBB1E5', '#FFC0CB', '#FFA07A', '#20B2AA', '#87CEFA'
              ]
              return colorList[params.dataIndex]
            }
          },
          label: {
            show: true,
            position: 'right'
          }
        }]
      }

      chartInstance.setOption(option)
    }

    // 加载数据
    const loadData = async () => {
      try {
        const res = await QuestionAnalysisApi.getQuestionEfficiency(
            props.subject,
            props.questionType,
            1,
            10,
            true
        )

        updateChart(res.data.content)
      } catch (error) {
        console.error('加载效率数据失败:', error)
      }
    }

    // 更新图表
    const updateChart = (data: any[]) => {
      if (!chartInstance) return

      const yData = data.map(item => item.questionId.substring(0, 8) + '...')
      const seriesData = data.map(item => item.efficiency.toFixed(4))

      chartInstance.setOption({
        yAxis: { data: yData },
        series: [{
          data: seriesData
        }]
      })
    }

    // 窗口大小变化时重新调整图表大小
    const handleResize = () => {
      chartInstance?.resize()
    }

    onMounted(() => {
      initChart()
      loadData()
      window.addEventListener('resize', handleResize)
    })

    // 监听props变化
    watch(() => [props.subject, props.questionType], () => {
      loadData()
    })

    return {
      chartRef
    }
  }
})
</script>

<style scoped>
.chart-card {
  height: 400px;
}

.chart {
  width: 100%;
  height: 350px;
}
</style>