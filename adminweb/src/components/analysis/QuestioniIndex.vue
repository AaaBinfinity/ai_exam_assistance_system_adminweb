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
              :disabled="!filterForm.subject"
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
      <el-col :span="12">
        <question-accuracy-chart
            :subject="filterForm.subject"
            :question-type="filterForm.type"
        />
      </el-col>
      <el-col :span="12">
        <question-avg-score-chart
            :subject="filterForm.subject"
            :question-type="filterForm.type"
        />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <question-avg-duration-chart
            :subject="filterForm.subject"
            :question-type="filterForm.type"
        />
      </el-col>
      <el-col :span="12">
        <question-efficiency-chart
            :subject="filterForm.subject"
            :question-type="filterForm.type"
        />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <question-difficulty-chart
            :subject="filterForm.subject"
            :question-type="filterForm.type"
        />
      </el-col>
      <el-col :span="12">
        <question-analysis-table
            :subject="filterForm.subject"
            :question-type="filterForm.type"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getSubjectList, getExerciseTypes } from '@/api/exam/exercise'
import QuestionAccuracyChart from './question/QuestionAccuracyChart.vue'
import QuestionAvgScoreChart from './question/QuestionAvgScoreChart.vue'
import QuestionAvgDurationChart from './question/QuestionAvgDurationChart.vue'
import QuestionEfficiencyChart from './question/QuestionEfficiencyChart.vue'
import QuestionDifficultyChart from './question/QuestionDifficultyChart.vue'
import QuestionAnalysisTable from './question/QuestionAnalysisTable.vue'

interface FilterForm {
  subject: string
  type: string
}

export default defineComponent({
  name: 'QuestionAnalysis',
  components: {
    QuestionAccuracyChart,
    QuestionAvgScoreChart,
    QuestionAvgDurationChart,
    QuestionEfficiencyChart,
    QuestionDifficultyChart,
    QuestionAnalysisTable
  },
  setup() {
    const filterForm = ref<FilterForm>({
      subject: '',
      type: ''
    })

    const subjectOptions = ref<string[]>([])
    const typeOptions = ref<string[]>([])

    // 获取所有科目
    const fetchSubjects = async () => {
      try {
        const res = await getSubjectList()
        subjectOptions.value = res.data
      } catch (error) {
        ElMessage.error('获取学科列表失败，请稍后重试')
      }
    }

    // 根据选中的科目获取对应题型
    const fetchExerciseTypes = async (subject: string) => {
      try {
        const res = await getExerciseTypes(subject)
        typeOptions.value = res.data
      } catch (error) {
        ElMessage.error('获取题型列表失败，请稍后重试')
      }
    }

    // 监听 subject 变化，动态更新题型列表
    watch(
        () => filterForm.value.subject,
        (newSubject) => {
          filterForm.value.type = '' // 清空已选题型
          if (newSubject) {
            fetchExerciseTypes(newSubject)
          } else {
            typeOptions.value = []
          }
        }
    )

    const handleFilterChange = () => {
      // 子组件通过 props 响应变化
    }

    onMounted(() => {
      fetchSubjects()
    })

    return {
      filterForm,
      subjectOptions,
      typeOptions,
      handleFilterChange
    }
  }
})
</script>

<style scoped>
.question-analysis-container {
  padding: 24px;
  background-color: #f5f7fa;
}

/* 卡片容器样式优化 */
.filter-card {
  margin-bottom: 24px;
  border-radius: 10px;
  padding: 20px;
}

/* 表单容器样式优化 */
.filter-form {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  justify-content: space-between;
}

/* 表单项宽度调整 */
.filter-form .el-form-item {
  flex: 1 1 200px;
  min-width: 100px;
}

/* 图表行外边距 */
.chart-row {
  margin-bottom: 24px;
}

/* 卡片样式统一 */
.el-card {
  border-radius: 10px;
  height: 100%;
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 图表高度统一 */
.el-col > * {
  height: 100%;
}

/* 图表容器填满空间 */
.chart-row .el-col {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}



</style>

