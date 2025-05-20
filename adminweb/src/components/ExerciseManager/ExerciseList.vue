<template>
  <div class="exercise-list">
    <el-table
        :data="exerciseList"
        highlight-current-row
        @current-change="handleSelect"
        style="width: 100%"
    >
      <el-table-column prop="content" label="题目" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          {{ questionTypeMap[row.type] || row.type }}
        </template>
      </el-table-column>
      <el-table-column prop="difficulty" label="难度" width="80">
        <template #default="{ row }">
          <el-rate v-model="row.difficulty" disabled show-score :max="5" />
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        @current-change="onPageChange"
        layout="prev, pager, next"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getExerciseList } from '@/api/exam/exercise'

const props = defineProps({
  subject: String,Q
  type: String,
  questionTypeMap: Object as PropType<Record<string, string>>
})

const exerciseList = ref<Exercise[]>([])
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const emit = defineEmits(['select'])

const handleSelect = (row: Exercise) => {
  emit('select', row)
}

const fetchExerciseList = async () => {
  const pageIndex = pagination.value.current - 1
  const { data } = await getExerciseList(props.subject, props.type, pageIndex, pagination.value.size)
  exerciseList.value = data.content
  pagination.value.total = data.totalElements
}


const onPageChange = (page: number) => {
  pagination.value.current = page
  fetchExerciseList()
}

onMounted(() => {
  fetchExerciseList()
})
</script>
