<template>
  <div class="exam-setup-container">
    <el-card shadow="hover" class="setup-card">
      <div class="setup-header">
        <h2 class="setup-title">考试设置</h2>
        <p class="setup-subtitle">请选择学科并配置考试题型</p>
      </div>

      <div class="setup-content">
        <el-form label-position="top">
          <el-form-item label="选择学科" class="form-item">
            <el-select
                v-model="subject"
                filterable
                placeholder="请选择考试学科"
                style="width: 100%"
                size="large"
                @change="handleSubjectChange"
            >
              <el-option
                  v-for="(subj, index) in subjectList"
                  :key="index"
                  :label="subj"
                  :value="subj"
              />
            </el-select>
            <div class="form-tip">请选择您要考试的学科领域</div>
          </el-form-item>

          <div class="exam-info" v-if="subject">
            <h3 class="info-title"> {{ subject }} 考试须知</h3>
            <ul class="info-list">
              <li>请保持独立思考，严禁作弊行为。</li>
              <li>考试过程中请遵守平台规则和考试纪律。</li>
              <li>系统将自动记录并监控答题行为。</li>
              <li>诚信应考，展示真实水平。</li>
            </ul>
          </div>


          <el-button
              type="primary"
              size="large"
              @click="openTypeDialog"
              :disabled="!subject"
              class="setup-button"
          >
            配置题型与题量
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </el-form>
      </div>
    </el-card>

    <!-- 题型设置弹窗 -->
    <el-dialog
        v-model="typeDialogVisible"
        :title="`${subject} - 题型配置`"
        width="700px"
        :close-on-click-modal="false"
        class="type-dialog"
    >
      <div class="type-dialog-content">
        <div class="dialog-header">
          <h3 class="current-subject">当前学科: {{ subject }}</h3>
          <el-alert
              title="请设置各题型的题目数量"
              type="info"
              :closable="false"
              show-icon
              class="dialog-alert"
          />
        </div>

        <div class="type-options">
          <div v-for="(item, index) in typeOptions" :key="index" class="type-item">
            <div class="type-info">
              <span class="type-label">{{ item.type }}</span>
              <el-tag type="info" size="small" v-if="item.example">示例: {{ item.example }}</el-tag>
            </div>
            <el-input-number
                v-model="item.count"
                :min="0"
                :max="20"
                size="large"
                controls-position="right"
                @change="updateTotalCount"
            />
          </div>
        </div>

        <div class="summary-section">
          <div class="summary-item">
            <span class="summary-label">已选题型:</span>
            <span class="summary-value">{{ selectedTypeCount }}种</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">总题数:</span>
            <span class="summary-value" :class="{ 'warning': totalCount === 0 }">
        {{ totalCount }}题
      </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">考试时长:</span>
            <el-input-number
                v-model="examDuration"
                :min="1"
                :max="180"
                size="small"
                controls-position="right"
                :disabled="totalCount === 0"
            />
            <span class="summary-value" style="margin-left: 8px">分钟</span>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button @click="typeDialogVisible = false" size="large">取消</el-button>
          <el-button
              type="primary"
              @click="startExam"
              size="large"
              :disabled="totalCount === 0"
          >
            开始考试
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import { getSubjectList, getExerciseTypes } from '@/api/exam/exercise'

const router = useRouter()
const subject = ref('')
const subjectList = ref<string[]>([])
const typeDialogVisible = ref(false)
const examDuration = ref(30) // 默认30分钟

// 题型配置数据
const typeOptions = ref<{ type: string, count: number, example?: string }[]>([])



// 计算属性
const selectedTypeCount = computed(() => {
  return typeOptions.value.filter(t => t.count > 0).length
})

const totalCount = computed(() => {
  return typeOptions.value.reduce((sum, item) => sum + item.count, 0)
})

// 获取学科列表
const fetchSubjects = async () => {
  try {
    const res = await getSubjectList()
    subjectList.value = res.data
    if (res.data.length > 0 && !subject.value) {
      subject.value = res.data[0]
    }
  } catch {
    ElMessage.error('获取学科列表失败')
  }
}

// 学科变更处理
const handleSubjectChange = () => {
  typeOptions.value = []
}

// 获取题型列表
const fetchExerciseTypes = async () => {
  if (!subject.value) return

  try {
    const res = await getExerciseTypes(subject.value)
    typeOptions.value = res.data.map(type => ({
      type,
      count: 0
    }))
  } catch {
    typeOptions.value = [
      { type: '选择题', count: 0},
      { type: '填空题', count: 0},
      { type: '简答题', count: 0}
    ]
    ElMessage.warning('使用默认题型配置')
  }
}

// 打开题型设置弹窗
const openTypeDialog = async () => {
  if (!subject.value) {
    ElMessage.warning('请先选择学科')
    return
  }

  await fetchExerciseTypes()
  typeDialogVisible.value = true
}

// 更新总题数
const updateTotalCount = () => {
  if (totalCount.value > 50) {
    ElMessage.warning('总题数不宜超过50题')
  }
}

// 开始考试
const startExam = () => {
  if (totalCount.value === 0) {
    ElMessage.warning('请至少设置一种题型的题量')
    return
  }

  const selectedTypes = typeOptions.value.filter(t => t.count > 0)

  router.push({
    name: 'ExamPage',
    query: {
      subject: subject.value,
      types: JSON.stringify(selectedTypes),
      total: totalCount.value.toString(),
      duration: examDuration.value.toString() // 改为使用用户设置的时长
    }
  })

  typeDialogVisible.value = false
}

onMounted(fetchSubjects)
</script>

<style scoped lang="scss">
.exam-setup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.setup-card {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.setup-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.setup-title {
  margin-bottom: 8px;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.setup-subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.setup-content {
  padding: 0 20px;
}

.form-item {
  margin-bottom: 24px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.exam-info {
  margin: 24px 0;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.info-title {
  margin-top: 0;
  margin-bottom: 12px;
  color: #303133;
  font-size: 16px;
}

.info-list {
  margin: 0;
  padding-left: 20px;
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}

.setup-button {
  width: 100%;
  margin-top: 16px;
  font-weight: 500;
}

.type-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
  }
}

.type-dialog-content {
  padding: 0 20px;
}

.dialog-header {
  margin-bottom: 20px;
}

.current-subject {
  margin: 0 0 8px 0;
  color: #303133;
  text-align: center;
}

.dialog-alert {
  margin-bottom: 16px;
}

.type-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.type-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    background-color: #f0f2f5;
  }
}

.type-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.type-label {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.summary-section {
  display: flex;
  justify-content: space-around;
  margin: 24px 0;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;

  &.warning {
    color: #e6a23c;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .setup-card {
    max-width: 100%;
  }

  .summary-section {
    flex-direction: column;
    gap: 12px;
  }
}
</style>