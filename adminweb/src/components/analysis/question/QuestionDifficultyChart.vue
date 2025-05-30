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

    // 初始化图表
    const initChart = () => {
      if (!chartRef.value) return

      chartInstance = echarts.init(chartRef.value)

      const option = {
        title: { text: '题目难度分布' },
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
        xAxis: {
          type: 'category',
          data: ['难度1', '难度2', '难度3', '难度4'],
          axisLabel: {
            interval: 0
          }
        },
        yAxis: { type: 'value', name: '数量' },
        series: [{
          type: 'bar',
          data: [],
          itemStyle: {
            color: function(params: any) {
              const colors = ['#67C23A', '#409EFF', '#E6A23C', '#F56C6C']
              return colors[params.dataIndex]
            }
          },
          label: {
            show: true,
            position: 'top'
          }
        }]
      }

      chartInstance.setOption(option)
    }

    // 加载数据
    const loadData = async () => {
      try {
        const res = await QuestionAnalysisApi.getQuestionDifficultyLevel(
            props.subject,
            props.questionType,
            1,
            100,
            false
        )

        updateChart(res.data.content)
      } catch (error) {
        console.error('加载难度数据失败:', error)
      }
    }

    // 更新图表
    const updateChart = (data: any[]) => {
      if (!chartInstance) return

      // 统计各难度级别的题目数量
      const difficultyCount = [0, 0, 0, 0]
      data.forEach(item => {
        if (item.difficultyLevel >= 1 && item.difficultyLevel <= 4) {
          difficultyCount[item.difficultyLevel - 1]++
        }
      })

      chartInstance.setOption({
        series: [{
          data: difficultyCount
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