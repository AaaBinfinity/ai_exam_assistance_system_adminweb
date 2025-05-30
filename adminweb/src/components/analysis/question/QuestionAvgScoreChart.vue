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
  name: 'QuestionAvgScoreChart',
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
        title: { text: '题目平均得分TOP10' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: { type: 'value', name: '平均分' },
        yAxis: { type: 'category', data: [] },
        series: [{
          type: 'bar',
          data: [],
          itemStyle: {
            color: function(params: any) {
              const colorList = [
                '#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C',
                '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3'
              ]
              return colorList[params.dataIndex]
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          }
        }]
      }

      chartInstance.setOption(option)
    }

    // 加载数据
    const loadData = async () => {
      try {
        const page = 1;
        const res = await QuestionAnalysisApi.getQuestionAvgScore(
            props.subject,
            props.questionType,
            page -1,
            10,
            true
        )

        updateChart(res.data.content)
      } catch (error) {
        console.error('加载平均分数据失败:', error)
      }
    }

    // 更新图表
    const updateChart = (data: any[]) => {
      if (!chartInstance) return

      const yData = data.map(item => item.questionId.substring(0, 8) + '...')
      const seriesData = data.map(item => item.avgScore.toFixed(2))

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