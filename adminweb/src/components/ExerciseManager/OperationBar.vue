<template>
  <div class="operation-bar">
    <!-- 筛选区域 -->
    <div class="filter-group">
      <el-select
          v-model="localSubject"
          placeholder="选择学科"
          clearable
          size="small"
          class="filter-item"
      >
        <el-option
            v-for="item in subjectOptions"
            :key="item"
            :label="item"
            :value="item"
        />
      </el-select>

      <el-select
          v-model="localType"
          placeholder="选择题型"
          clearable
          size="small"
          class="filter-item"
      >
        <el-option
            v-for="(label, key) in props.questionTypeMap"
            :key="key"
            :label="label"
            :value="key"
        />
      </el-select>

      <el-button type="primary" size="small" @click="emitFilter">
        筛选
      </el-button>
      <el-button size="small" @click="resetFilter">
        重置
      </el-button>
    </div>


    <!-- 操作按钮区域 -->
    <div class="action-group">
      <el-button type="primary" size="small" @click="handleAdd">
        添加习题
      </el-button>
      <el-button size="small" @click="handleBatchAdd">
        批量添加
      </el-button>
      <el-button
          type="danger"
          size="small"
          :disabled="!props.selectedExercises || props.selectedExercises.length === 0"
          @click="handleDelete"
      >
        删除选中
      </el-button>
      <el-button size="small" :icon="Refresh" @click="handleRefresh">
        刷新
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'

import { ElMessageBox, ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getExerciseList, getSubjectList } from '@/api/exam/exercise'
import { deleteExercise, batchDeleteExercises } from '@/api/exam/manager'
import type { Exercise } from '@/api/exam/types'

const props = defineProps({
  selectedExercise: {
    type: Object as PropType<Exercise | null>,
    default: null,
  },
  selectedExercises: {
    type: Array as PropType<Exercise[]>,
    default: () => [],
  },
  questionTypeMap: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'batch-add'): void
  (e: 'delete'): void
  (e: 'filter', result: Exercise[]): void
  (e: 'refresh'): void
}>()

const localSubject = ref<string | null>(null)
const localType = ref<string | null>(null)
const subjectOptions = ref<string[]>([])

const resetFilter = () => {
  localSubject.value = null
  localType.value = null
  emit('filter', {
    subject: null,
    type: null
  })
}
const fetchSubjectOptions = async () => {
  try {
    const res = await getSubjectList()
    subjectOptions.value = res.data
  } catch (error) {
    ElMessage.error('获取学科失败')
  }
}

onMounted(() => {
  fetchSubjectOptions()
})

const handleAdd = () => emit('add')
const handleBatchAdd = () => emit('batch-add')

// ✅ 批量删除按钮逻辑
const handleDelete = async () => {
  if (!props.selectedExercises || props.selectedExercises.length === 0) {
    ElMessage.warning('请先选择习题')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${props.selectedExercises.length} 道习题吗？`, '警告', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })

    const ids = props.selectedExercises.map(item => item.id)
    await batchDeleteExercises(ids)

    ElMessage.success('批量删除成功')
    emit('delete')
  } catch (err) {
    ElMessage.info('已取消删除')
  }
}

const handleRefresh = () => emit('refresh')

const emitFilter = () => {
  emit('filter', {
    subject: localSubject.value,
    type: localType.value
  })
}

</script>


<style scoped>
.operation-bar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  gap: 12px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-group,
.action-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-item {
  width: 150px;
}
</style>
