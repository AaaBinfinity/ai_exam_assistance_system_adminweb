<template>
  <div class="exercise-list">
    <el-table
        :data="exerciseList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <!-- 选择列 -->
      <el-table-column
          type="selection"
          width="55"
          @click.stop=""
      />

      <!-- ID 列 -->
      <el-table-column prop="id" label="ID" width="180" />

      <!-- 题目内容列 -->
      <el-table-column prop="content" label="题目">
        <template #default="{ row }">
          <div v-html="row.content"></div>
        </template>
      </el-table-column>

      <!-- 学科列 -->
      <el-table-column prop="subject" label="学科" width="160" />

      <!-- 类型列 -->
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          {{ questionTypeMap[row.type] || row.type }}
        </template>
      </el-table-column>

      <!-- 难度列 -->
      <el-table-column prop="difficulty" label="难度" width="120">
        <template #default="{ row }">
          <el-rate
              v-model="row.difficulty"
              disabled
              show-score
              :max="5"
              :score-template="`${row.difficulty}/5`"
          />
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click.stop="openEditDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <PaginationBar
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        layout="prev, pager, next"
        @update:currentPage="pagination.current = $event"
        @update:pageSize="pagination.size = $event"
        @change="fetchExerciseList"
    />

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑习题" width="60%">
      <ExerciseDetail
          v-if="editDialogVisible"
          :exercise="currentExercise"
          :questionTypeMap="questionTypeMap"
          :viewMode="false"
          @save="handleSave"
          @cancel="editDialogVisible = false"
          @add-option="addOption"
          @remove-option="removeOption"
          @remove-attachment="removeAttachment"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { PropType } from 'vue'
import { getExerciseList } from '@/api/exam/exercise'
import ExerciseDetail from './ExerciseDetail.vue'

interface Exercise {
  id: string;
  content: string;
  type: string;
  difficulty: number;
  options?: string[];
  attachments?: Array<{ id: string }>;
}

// Props
const props = defineProps({
  subject: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: null
  },
  questionTypeMap: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['select', 'edit'])

// 选中行集合
const selectedRows = ref<Exercise[]>([])
const handleSelectionChange = (rows: Exercise[]) => {
  selectedRows.value = rows
  emit('select', rows)
}


// 数据定义
const exerciseList = ref<Exercise[]>([])
const pagination = ref({ current: 1, size: 10, total: 0 })

// 编辑弹窗状态
const editDialogVisible = ref(false)
const currentExercise = ref<Exercise | null>(null)

// 获取习题列表
const fetchExerciseList = async () => {
  const pageIndex = pagination.value.current - 1
  try {
    const { data } = await getExerciseList(
        props.subject,
        props.type,
        pageIndex,
        pagination.value.size
    )
    exerciseList.value = data.content || []
    pagination.value.total = data.totalElements || 0
  } catch (error) {
    console.error('获取习题失败：', error)
  }
}

// 打开编辑弹窗
const openEditDialog = (exercise: Exercise) => {
  currentExercise.value = JSON.parse(JSON.stringify(exercise)) // 深拷贝，避免原数据被修改
  editDialogVisible.value = true
}

// 保存编辑后的数据
const handleSave = (updatedExercise: Exercise) => {
  if (currentExercise.value) {
    emit('edit', updatedExercise)
    editDialogVisible.value = false
    fetchExerciseList()
  }
}

// 编辑弹窗中的操作函数
const addOption = () => {
  if (currentExercise.value) {
    if (!currentExercise.value.options) {
      currentExercise.value.options = []
    }
    currentExercise.value.options.push('')
  }
}

const removeOption = (index: number) => {
  if (currentExercise.value?.options) {
    currentExercise.value.options.splice(index, 1)
  }
}

const removeAttachment = (id: string) => {
  if (currentExercise.value?.attachments) {
    currentExercise.value.attachments = currentExercise.value.attachments.filter(f => f.id !== id)
  }
}

// 监听筛选条件变化
watch(
    () => [props.subject, props.type],
    () => {
      pagination.value.current = 1
      fetchExerciseList()
    },
    { immediate: true }
)

onMounted(fetchExerciseList)

// 暴露刷新方法
defineExpose({
  fetchExerciseList
})
</script>


<style scoped>
.exercise-list {
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

/* 表格内容行样式 */
:deep(.el-table) {
  font-size: 14px;
}

/* 表格头部加粗 */
:deep(.el-table__header-wrapper th) {
  font-weight: 600;
  background-color: #f5f7fa;
}

/* 表格单元格内边距优化 */
:deep(.el-table__cell) {
  padding: 12px 10px;
}

/* ID 列字体颜色 */
:deep(.el-table__row td:first-child) {
  color: #999;
}

/* 难度星星组件显示靠右 */
:deep(.el-rate) {
  display: inline-flex;
  align-items: center;
}

/* 编辑按钮居中 */
:deep(.el-button) {
  margin: 0 4px;
}

/* 编辑弹窗内容样式微调 */
:deep(.el-dialog__body) {
  padding-top: 10px;
}

/* 分页栏样式 */
:deep(.el-pagination) {
  margin-top: 16px;
  justify-content: center;
}
</style>