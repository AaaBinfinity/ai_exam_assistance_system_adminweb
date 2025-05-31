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
  name: 'QuestionDifficultyChart',
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

    const initChart = () => {
      if (!chartRef.value) return
      chartInstance = echarts.init(chartRef.value)

      const option = {
        title: {
          text: '题目难度分布',
          left: 'center',
          top: 10,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: ['难度1', '难度2', '难度3', '难度4', '难度5']
        },
        series: [
          {
            name: '难度分布',
            type: 'pie',
            radius: ['40%', '65%'],
            center: ['50%', '50%'],
            data: [],
            label: {
              formatter: '{b}: {c} ({d}%)',
              fontSize: 12
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 8,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              }
            }
          }
        ]
      }

      chartInstance.setOption(option)
    }

    const loadData = async () => {
      try {
        const page = 1
        const res = await QuestionAnalysisApi.getQuestionDifficultyLevel(
            props.subject,
            props.questionType,
            page - 1,
            1000,
            false
        )
        updateChart(res.data.content)
      } catch (error) {
        console.error('加载难度数据失败:', error)
      }
    }

    const updateChart = (data: any[]) => {
      if (!chartInstance) return

      const difficultyCount = [0, 0, 0, 0, 0]
      data.forEach(item => {
        const level = item.difficultyLevel
        if (level >= 1 && level <= 5) {
          difficultyCount[level - 1]++
        }
      })

      const chartData = difficultyCount.map((count, index) => ({
        value: count,
        name: `难度${index + 1}`
      }))

      chartInstance.setOption({
        series: [{ data: chartData }]
      })
    }

    const handleResize = () => {
      chartInstance?.resize()
    }

    onMounted(() => {
      initChart()
      loadData()
      window.addEventListener('resize', handleResize)
    })

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
  height: 500px;
}
.chart {
  width: 100%;
  height: 380px;
}
</style>
