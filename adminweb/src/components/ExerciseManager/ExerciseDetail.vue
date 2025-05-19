<template>
  <div class="exercise-detail" v-if="exercise">
    <el-form label-width="100px">
      <el-form-item label="题目类型">
        <el-select v-model="exercise.questionType" :disabled="viewMode">
          <el-option
              v-for="(label, value) in questionTypeMap"
              :key="value"
              :label="label"
              :value="value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题目内容">
        <el-input v-model="exercise.question" type="textarea" :rows="3" :disabled="viewMode" />
      </el-form-item>

      <el-form-item v-if="['single', 'multiple'].includes(exercise.questionType)" label="选项">
        <div v-for="(option, index) in exercise.options" :key="index" class="option-item">
          <el-input v-model="exercise.options[index]" :disabled="viewMode" style="width: 80%" />
          <el-button
              type="danger"
              circle
              icon="Delete"
              @click="$emit('remove-option', index)"
              :disabled="viewMode"
          />
        </div>
        <el-button type="primary" @click="$emit('add-option')" :disabled="viewMode">添加选项</el-button>
      </el-form-item>

      <el-form-item label="正确答案">
        <template v-if="['single', 'multiple'].includes(exercise.questionType)">
          <el-checkbox-group v-model="exercise.answer" :disabled="viewMode">
            <el-checkbox
                v-for="(option, index) in exercise.options"
                :key="index"
                :label="String.fromCharCode(65 + index)"
            />
          </el-checkbox-group>
        </template>
        <template v-else-if="exercise.questionType === 'judgment'">
          <el-radio-group v-model="exercise.answer" :disabled="viewMode">
            <el-radio label="正确" />
            <el-radio label="错误" />
          </el-radio-group>
        </template>
        <template v-else>
          <el-input v-model="exercise.answer" type="textarea" :rows="3" :disabled="viewMode" />
        </template>
      </el-form-item>

      <el-form-item label="解析">
        <el-input v-model="exercise.analysis" type="textarea" :rows="3" :disabled="viewMode" />
      </el-form-item>

      <el-form-item label="难度">
        <el-rate v-model="exercise.difficulty" :disabled="viewMode" :max="5" />
      </el-form-item>

      <el-form-item label="附件">
        <div v-if="exercise.attachments?.length">
          <div v-for="file in exercise.attachments" :key="file.id" class="attachment-item">
            <el-link :href="file.url" target="_blank">{{ file.name }}</el-link>
            <el-button
                type="danger"
                size="small"
                circle
                icon="Delete"
                @click="$emit('remove-attachment', file.id)"
            />
          </div>
        </div>
        <div v-else>暂无附件</div>
      </el-form-item>

      <el-form-item>
        <el-button v-if="viewMode" type="primary" @click="$emit('toggle-edit')">编辑</el-button>
        <template v-else>
          <el-button type="primary" @click="$emit('save')">保存</el-button>
          <el-button @click="$emit('cancel')">取消</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  exercise: Object as PropType<Exercise>,
  viewMode: Boolean,
  questionTypeMap: Object as PropType<Record<string, string>>
})

defineEmits([
  'save',
  'cancel',
  'toggle-edit',
  'add-option',
  'remove-option',
  'remove-attachment'
])
</script>
