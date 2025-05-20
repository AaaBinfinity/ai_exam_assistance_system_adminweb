<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { batchAddExercises } from '@/api/exam/manager'
import * as XLSX from 'xlsx'
import { UploadFilled } from '@element-plus/icons-vue'


// 弹窗显示控制
const visible = defineModel<boolean>()

// 上传文件引用
const uploadFiles = ref<any[]>([])
const fileList = ref<File[]>([])

// 模板路径
const templatePath = new URL('@/assets/example/example.xlsx', import.meta.url).href

// 下载模板
function downloadTemplate() {
  window.open(templatePath, '_blank')
}

// 处理上传文件变化
function handleFileChange(uploadFile: any, uploadFilesRaw: any[]) {
  const validFiles = uploadFilesRaw.filter(f => f.raw && /\.(xls|xlsx)$/.test(f.raw.name))

  if (validFiles.length === 0) {
    ElMessage.warning('请上传 .xls 或 .xlsx 格式的 Excel 文件')
    return
  }

  const uniqueMap = new Map<string, any>()
  for (const f of [...uploadFiles.value, ...validFiles]) {
    uniqueMap.set(f.name, f)
  }

  uploadFiles.value = Array.from(uniqueMap.values())
  fileList.value = uploadFiles.value.map(f => f.raw)
}

// 确认上传操作
async function confirmAndUpload() {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择要上传的 Excel 文件')
    return
  }

  try {
    await ElMessageBox.confirm(
        `确定上传 ${fileList.value.length} 个文件吗？`,
        '上传确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )

    for (const file of fileList.value) {
      await processExcelFile(file)
    }

    ElMessage.success('全部文件上传成功')
    resetState()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '上传失败，请检查文件内容')
    }
  }
}

// 处理每个 Excel 文件
async function processExcelFile(file: File) {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data, { type: 'array' })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const raw = XLSX.utils.sheet_to_json<any>(worksheet)

  if (!Array.isArray(raw)) {
    throw new Error(`文件 ${file.name} 内容格式错误，应为表格数据`)
  }

  const questions = raw.map((item, index) => {
    try {
      return {
        ...item,
        options: typeof item.options === 'string' ? JSON.parse(item.options) : item.options,
        answer: typeof item.answer === 'string' ? JSON.parse(item.answer) : item.answer,
      }
    } catch (e) {
      throw new Error(`文件 ${file.name} 第 ${index + 2} 行 options 或 answer 字段格式有误`)
    }
  })

  await batchAddExercises(questions)
}

// 重置上传状态
function resetState() {
  visible.value = false
  fileList.value = []
  uploadFiles.value = []
}
</script>

<template>
  <el-dialog v-model="visible" title="批量添加习题" width="50%" @close="resetState">
    <el-upload
        class="excel-upload"
        drag
        multiple
        accept=".xls,.xlsx"
        :auto-upload="false"
        :on-change="handleFileChange"
        :show-file-list="true"
        :file-list="uploadFiles"
    >
      <template>
        <el-icon>
          <UploadFilled />
        </el-icon>
      </template>
      <div class="el-upload__text">
        将 Excel 文件拖到此处，或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">请上传 .xls 或 .xlsx 格式的 Excel 文件</div>
        <el-button type="primary" link @click="downloadTemplate">下载示例模板</el-button>
      </template>
    </el-upload>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirmAndUpload">上传</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.excel-upload {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
