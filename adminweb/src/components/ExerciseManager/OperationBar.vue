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
            v-for="(label, key) in questionTypeMap"
            :key="key"
            :label="label"
            :value="key"
        />
      </el-select>

      <el-button type="primary" size="small" @click="emitFilter">
        筛选
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
          :disabled="!selectedExercise"
          @click="handleDelete"
      >
        删除
      </el-button>
      <el-button size="small" :icon="Refresh" @click="handleRefresh">
        刷新
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType } from 'vue'
import { Exercise } from '@/api/exam/types'
import { Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  selectedExercise: {
    type: Object as PropType<Exercise | null>,
    default: null,
  },
  subjectOptions: {
    type: Array as PropType<string[]>,
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
  (e: 'filter', filter: { subject: string | null; type: string | null }): void
  (e: 'refresh'): void
}>()

const localSubject = ref<string | null>(null)
const localType = ref<string | null>(null)

const handleAdd = () => emit('add')
const handleBatchAdd = () => emit('batch-add')
const handleDelete = () => props.selectedExercise && emit('delete')
const handleRefresh = () => emit('refresh')

const emitFilter = () => {
  emit('filter', {
    subject: localSubject.value,
    type: localType.value,
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
