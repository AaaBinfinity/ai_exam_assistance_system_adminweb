<template>
  <div class="dashboard-page">
    <h3>习题分析</h3>
    <question-analysis />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QuestionAnalysis from '@/components/analysis/QuestioniIndex.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    QuestionAnalysis
  }
})
</script>

<style scoped>
.dashboard-page {
  padding: 24px;
}
</style>
