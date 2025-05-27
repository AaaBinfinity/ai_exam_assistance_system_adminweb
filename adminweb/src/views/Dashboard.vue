<template>
  <div class="question-analysis-container">
    <el-card shadow="hover" class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="科目">
          <el-select
              v-model="filterForm.subject"
              placeholder="请选择科目"
              clearable
              @change="handleFilterChange"
          >
            <el-option
                v-for="subject in subjectOptions"
                :key="subject"
                :label="subject"
                :value="subject"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-select
              v-model="filterForm.type"
              placeholder="请选择题型"
              clearable
              @change="handleFilterChange"
          >
            <el-option
                v-for="type in typeOptions"
                :key="type"
                :label="type"
                :value="type"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="chart-row">
      <!-- 准确率图表 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="accuracyChart" class="chart"></div>
        </el-card>
      </el-col>

      <!-- 平均得分图表 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="avgScoreChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 平均答题时间图表 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="avgDurationChart" class="chart"></div>
        </el-card>
      </el-col>

      <!-- 作答效率图表 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="efficiencyChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 难度等级图表 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="difficultyChart" class="chart"></div>
        </el-card>
      </el-col>

      <!-- 综合分析表格 -->
      <el-col :span="12">
        <el-card shadow="hover" class="table-card">
          <el-table
              :data="analysisData"
              border
              style="width: 100%"
              height="400"
              v-loading="loading"
          >
            <el-table-column prop="questionId" label="题目ID" width="180" />
            <el-table-column prop="subject" label="科目" width="120" />
            <el-table-column prop="type" label="题型" width="100" />
            <el-table-column prop="questionAccuracy" label="准确率" width="100">
              <template #default="{ row }">
                {{ (row.questionAccuracy * 100).toFixed(1) }}%
              </template>
            </el-table-column>
            <el-table-column prop="difficultyLevel" label="难度" width="80">
              <template #default="{ row }">
                <el-tag :type="getDifficultyTagType(row.difficultyLevel)">
                  {{ row.difficultyLevel }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="avgScore" label="平均分" width="80" />
            <el-table-column prop="avgDurationS" label="平均用时(s)" width="100" />
            <el-table-column prop="efficiency" label="效率" width="80">
              <template #default="{ row }">
                {{ row.efficiency.toFixed(4) }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              class="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.current"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pagination.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from 'vue'
import * as echarts from 'echarts'
import { QuestionAnalysisApi } from '@/api/analysis/question'
import {QuestionAnalysis} from "@/api/analysis/types";

export default defineComponent({
  name: 'QuestionAnalysis',
  setup() {
    // 图表引用
    const accuracyChart = ref<HTMLElement | null>(null)
    const avgScoreChart = ref<HTMLElement | null>(null)
    const avgDurationChart = ref<HTMLElement | null>(null)
    const efficiencyChart = ref<HTMLElement | null>(null)
    const difficultyChart = ref<HTMLElement | null>(null)

    // 图表实例
    let accuracyChartInstance: echarts.ECharts | null = null
    let avgScoreChartInstance: echarts.ECharts | null = null
    let avgDurationChartInstance: echarts.ECharts | null = null
    let efficiencyChartInstance: echarts.ECharts | null = null
    let difficultyChartInstance: echarts.ECharts | null = null

    // 筛选表单
    const filterForm = ref({
      subject: '',
      type: ''
    })

    // 科目和题型选项（可以从接口获取或静态定义）
    const subjectOptions = ref([
      '大数据技术框架',
      '操作系统',
      '数据可视化',
      '当代大学生国家安全教育'
    ])

    const typeOptions = ref([
      '单选题',
      '多选题',
      '填空题',
      '判断题',
      '简答题'
    ])

    // 分析数据
    const analysisData = ref<QuestionAnalysis[]>([])
    const loading = ref(false)

    // 分页
    const pagination = ref({
      current: 1,
      size: 10,
      total: 0
    })

    // 初始化图表
    const initCharts = () => {
      accuracyChartInstance = echarts.init(accuracyChart.value!)
      avgScoreChartInstance = echarts.init(avgScoreChart.value!)
      avgDurationChartInstance = echarts.init(avgDurationChart.value!)
      efficiencyChartInstance = echarts.init(efficiencyChart.value!)
      difficultyChartInstance = echarts.init(difficultyChart.value!)

      // 设置默认图表配置
      const defaultOption = {
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
        }
      }

      accuracyChartInstance.setOption({
        ...defaultOption,
        title: { text: '题目准确率TOP10' },
        xAxis: { type: 'value', name: '准确率(%)' },
        yAxis: { type: 'category', data: [] },
        series: [{ type: 'bar', data: [] }]
      })

      avgScoreChartInstance.setOption({
        ...defaultOption,
        title: { text: '题目平均得分TOP10' },
        xAxis: { type: 'value', name: '平均分' },
        yAxis: { type: 'category', data: [] },
        series: [{ type: 'bar', data: [] }]
      })

      avgDurationChartInstance.setOption({
        ...defaultOption,
        title: { text: '题目平均答题时间TOP10' },
        xAxis: { type: 'value', name: '时间(s)' },
        yAxis: { type: 'category', data: [] },
        series: [{ type: 'bar', data: [] }]
      })

      efficiencyChartInstance.setOption({
        ...defaultOption,
        title: { text: '题目作答效率TOP10' },
        xAxis: { type: 'value', name: '效率' },
        yAxis: { type: 'category', data: [] },
        series: [{ type: 'bar', data: [] }]
      })

      difficultyChartInstance.setOption({
        ...defaultOption,
        title: { text: '题目难度分布' },
        xAxis: { type: 'category', data: ['难度1', '难度2', '难度3', '难度4'] },
        yAxis: { type: 'value', name: '数量' },
        series: [{ type: 'bar', data: [] }]
      })
    }

    // 获取难度标签类型
    const getDifficultyTagType = (level: number) => {
      const types = [1,2,3,4,5]
      return types[level] || ''
    }

    // 加载数据
    const loadData = async () => {
      try {
        loading.value = true

        // 加载综合分析数据
        const analysisRes = await QuestionAnalysisApi.getQuestionAnalysisPage(
            pagination.value.current,
            pagination.value.size
        )
        analysisData.value = analysisRes.data.content
        pagination.value.total = analysisRes.data.totalElements

        // 加载各维度图表数据
        await loadChartData()
      } catch (error) {
        console.error('加载习题分析数据失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 加载图表数据
    const loadChartData = async () => {
      try {
        // 准确率数据
        const accuracyRes = await QuestionAnalysisApi.getQuestionAccuracy(
            filterForm.value.subject,
            filterForm.value.type,
            1,
            10,
            true
        )
        updateAccuracyChart(accuracyRes.data.content)

        // 平均得分数据
        const avgScoreRes = await QuestionAnalysisApi.getQuestionAvgScore(
            filterForm.value.subject,
            filterForm.value.type,
            1,
            10,
            true
        )
        updateAvgScoreChart(avgScoreRes.data.content)

        // 平均答题时间数据
        const avgDurationRes = await QuestionAnalysisApi.getQuestionAvgDuration(
            filterForm.value.subject,
            filterForm.value.type,
            1,
            10,
            true
        )
        updateAvgDurationChart(avgDurationRes.data.content)

        // 作答效率数据
        const efficiencyRes = await QuestionAnalysisApi.getQuestionEfficiency(
            filterForm.value.subject,
            filterForm.value.type,
            1,
            10,
            true
        )
        updateEfficiencyChart(efficiencyRes.data.content)

        // 难度等级数据
        const difficultyRes = await QuestionAnalysisApi.getQuestionDifficultyLevel(
            filterForm.value.subject,
            filterForm.value.type,
            1,
            100,
            false
        )
        updateDifficultyChart(difficultyRes.data.content)
      } catch (error) {
        console.error('加载图表数据失败:', error)
      }
    }

    // 更新准确率图表
    const updateAccuracyChart = (data: any[]) => {
      if (!accuracyChartInstance) return

      const yData = data.map(item => item.questionId.substring(0, 8) + '...')
      const seriesData = data.map(item => (item.questionAccuracy * 100).toFixed(1))

      accuracyChartInstance.setOption({
        yAxis: { data: yData },
        series: [{
          data: seriesData,
          itemStyle: {
            color: function(params: any) {
              // 颜色渐变
              const colorList = [
                '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
                '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570'
              ]
              return colorList[params.dataIndex]
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%'
          }
        }]
      })
    }

    // 更新平均得分图表
    const updateAvgScoreChart = (data: any[]) => {
      if (!avgScoreChartInstance) return

      const yData = data.map(item => item.questionId.substring(0, 8) + '...')
      const seriesData = data.map(item => item.avgScore.toFixed(2))

      avgScoreChartInstance.setOption({
        yAxis: { data: yData },
        series: [{
          data: seriesData,
          itemStyle: {
            color: function(params: any) {
              // 颜色渐变
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
      })
    }

    // 更新平均答题时间图表
    const updateAvgDurationChart = (data: any[]) => {
      if (!avgDurationChartInstance) return

      const yData = data.map(item => item.questionId.substring(0, 8) + '...')
      const seriesData = data.map(item => item.avgDurationS.toFixed(2))

      avgDurationChartInstance.setOption({
        yAxis: { data: yData },
        series: [{
          data: seriesData,
          itemStyle: {
            color: function(params: any) {
              // 颜色渐变
              const colorList = [
                '#DD6B66', '#759AA0', '#E69D87', '#8DC1A9', '#EA7E53',
                '#EEDD78', '#73A373', '#73B9BC', '#7289AB', '#91CA8C'
              ]
              return colorList[params.dataIndex]
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}s'
          }
        }]
      })
    }

    // 更新作答效率图表
    const updateEfficiencyChart = (data: any[]) => {
      if (!efficiencyChartInstance) return

      const yData = data.map(item => item.questionId.substring(0, 8) + '...')
      const seriesData = data.map(item => item.efficiency.toFixed(4))

      efficiencyChartInstance.setOption({
        yAxis: { data: yData },
        series: [{
          data: seriesData,
          itemStyle: {
            color: function(params: any) {
              // 颜色渐变
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
      })
    }

    // 更新难度等级图表
    const updateDifficultyChart = (data: any[]) => {
      if (!difficultyChartInstance) return

      // 统计各难度级别的题目数量
      const difficultyCount = [0, 0, 0, 0]
      data.forEach(item => {
        if (item.difficultyLevel >= 1 && item.difficultyLevel <= 4) {
          difficultyCount[item.difficultyLevel - 1]++
        }
      })

      difficultyChartInstance.setOption({
        series: [{
          data: difficultyCount,
          type: 'bar',
          itemStyle: {
            color: function(params: any) {
              // 不同难度使用不同颜色
              const colors = ['#67C23A', '#409EFF', '#E6A23C', '#F56C6C']
              return colors[params.dataIndex]
            }
          },
          label: {
            show: true,
            position: 'top'
          }
        }]
      })
    }

    // 处理筛选条件变化
    const handleFilterChange = () => {
      loadChartData()
    }

    // 处理分页大小变化
    const handleSizeChange = (size: number) => {
      pagination.value.size = size
      loadData()
    }

    // 处理当前页变化
    const handleCurrentChange = (current: number) => {
      pagination.value.current = current
      loadData()
    }

    // 窗口大小变化时重新调整图表大小
    const handleResize = () => {
      accuracyChartInstance?.resize()
      avgScoreChartInstance?.resize()
      avgDurationChartInstance?.resize()
      efficiencyChartInstance?.resize()
      difficultyChartInstance?.resize()
    }

    onMounted(() => {
      initCharts()
      loadData()
      window.addEventListener('resize', handleResize)
    })

    return {
      accuracyChart,
      avgScoreChart,
      avgDurationChart,
      efficiencyChart,
      difficultyChart,
      filterForm,
      subjectOptions,
      typeOptions,
      analysisData,
      loading,
      pagination,
      getDifficultyTagType,
      handleFilterChange,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style scoped>
.question-analysis-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  align-items: center;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card, .table-card {
  height: 400px;
}

.chart {
  width: 100%;
  height: 350px;
}

.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>