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
                v-for="type in TYPE_OPTIONS"
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
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSubjectList } from '@/api/exam/exercise'
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

const TYPE_OPTIONS = ['单选题', '多选题', '填空题', '判断题', '简答题']

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

    const fetchSubjects = async () => {
      try {
        const res = await getSubjectList()
        subjectOptions.value = res.data
      } catch (error) {
        ElMessage.error('获取学科列表失败，请稍后重试')
      }
    }

    const handleFilterChange = () => {
      // 子组件通过 props 响应变化
    }

    onMounted(() => {
      fetchSubjects()
    })

    return {
      filterForm,
      subjectOptions,
      TYPE_OPTIONS,
      handleFilterChange
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
  flex-wrap: wrap;
  gap: 12px;
}

.chart-row {
  margin-bottom: 20px;
}
</style>
