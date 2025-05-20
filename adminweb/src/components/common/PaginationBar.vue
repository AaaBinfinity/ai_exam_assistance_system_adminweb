
<template>
  <div class="pagination-bar">
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  currentPage: number
  pageSize: number
  total: number
  pageSizes?: number[]
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change'): void
}>()

const pageSizes = props.pageSizes || [10, 20, 30, 50]

const onSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('update:currentPage', 1) // 更改 pageSize 后重置为第 1 页
  emit('change')
}

const onCurrentChange = (page: number) => {
  emit('update:currentPage', page)
  emit('change')
}
</script>

<style scoped>
.pagination-bar {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
