<template>
  <el-card shadow="hover" class="table-card">
    <el-table
        :data="tableData"
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
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { QuestionAnalysisApi } from '@/api/analysis/question'
import { QuestionAnalysis } from '@/api/analysis/types'

export default defineComponent({
  name: 'QuestionAnalysisTable',
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
    const tableData = ref<QuestionAnalysis[]>([])
    const loading = ref(false)

    const pagination = ref({
      current: 1,
      size: 10,
      total: 0
    })

    // 获取难度标签类型
    const getDifficultyTagType = (level: number) => {
      const types = ['', 'success', 'primary', 'warning', 'danger']
      return types[level] || ''
    }

    // 加载数据
    const loadData = async () => {
      try {
        loading.value = true

        const res = await QuestionAnalysisApi.getQuestionAnalysisPage(
            pagination.value.current,
            pagination.value.size,
            props.subject,
            props.questionType
        )

        tableData.value = res.data.content
        pagination.value.total = res.data.totalElements
      } catch (error) {
        console.error('加载表格数据失败:', error)
      } finally {
        loading.value = false
      }
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

    // 监听props变化
    watch(() => [props.subject, props.questionType], () => {
      pagination.value.current = 1
      loadData()
    })

    // 初始化加载数据
    loadData()

    return {
      tableData,
      loading,
      pagination,
      getDifficultyTagType,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style scoped>
.table-card {
  height: 500px;
}

.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>