<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getInboxMessages,
  getSentMessages,
  sendMessage,
  markAsRead
} from '@/api/user/messages';

const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(['update:modelValue']);

const activeTab = ref<'inbox' | 'sent'>('inbox');
const messages = ref<any[]>([]);
const loading = ref(false);
const page = ref(1);
const size = ref(10);
const total = ref(0);

// 发送消息用
const receiverId = ref('');
const content = ref('');

const fetchMessages = async () => {
  loading.value = true;
  try {
    const res = activeTab.value === 'inbox'
        ? await getInboxMessages(page.value, size.value)
        : await getSentMessages(page.value, size.value);
    messages.value = res.data?.records || [];
    total.value = res.data?.total || 0;
  } catch (err) {
    ElMessage.error('获取消息失败');
  } finally {
    loading.value = false;
  }
};

const handleClose = () => emit('update:modelValue', false);

const markMessageAsRead = async (id: string) => {
  try {
    await markAsRead(id);
    messages.value = messages.value.map(msg =>
        msg.id === id ? { ...msg, read: true } : msg
    );
  } catch {
    ElMessage.error('标记为已读失败');
  }
};

const handleSend = async () => {
  if (!receiverId.value || !content.value) {
    ElMessage.warning('请填写完整信息');
    return;
  }
  try {
    await sendMessage(receiverId.value, content.value);
    ElMessage.success('发送成功');
    receiverId.value = '';
    content.value = '';
    activeTab.value = 'sent';
    fetchMessages();
  } catch {
    ElMessage.error('发送失败');
  }
};

watch(() => props.modelValue, val => {
  if (val) fetchMessages();
});
watch(activeTab, () => {
  page.value = 1;
  fetchMessages();
});
</script>

<template>
  <el-drawer
      v-model="props.modelValue"
      title="消息中心"
      size="40%"
      direction="rtl"
      @close="handleClose"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="收件箱" name="inbox" />
      <el-tab-pane label="已发送" name="sent" />
      <el-tab-pane label="发送消息" name="send" />
    </el-tabs>

    <el-scrollbar height="calc(100% - 160px)" v-if="activeTab !== 'send'">
      <el-skeleton :loading="loading" animated>
        <el-timeline>
          <el-timeline-item
              v-for="msg in messages"
              :key="msg.id"
              :timestamp="msg.sendTime"
              :type="activeTab === 'inbox' && !msg.read ? 'primary' : 'info'"
              placement="top"
          >
            <div class="message-item">
              <div class="message-header">
                <strong v-if="activeTab === 'inbox'">{{ msg.senderName }}</strong>
                <strong v-else>To: {{ msg.receiverName }}</strong>
                <el-tag size="small" type="success" v-if="activeTab === 'inbox' && !msg.read">未读</el-tag>
              </div>
              <p>{{ msg.content }}</p>
              <el-button
                  size="small"
                  type="text"
                  @click="markMessageAsRead(msg.id)"
                  v-if="activeTab === 'inbox' && !msg.read"
              >
                标记为已读
              </el-button>
            </div>
          </el-timeline-item>
        </el-timeline>
        <div style="margin-top: 16px; text-align: center">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="size"
              :current-page="page"
              @current-change="val => { page.value = val; fetchMessages(); }"
          />
        </div>
      </el-skeleton>
    </el-scrollbar>

    <!-- 发送消息面板 -->
    <div v-else style="padding: 16px">
      <el-form label-width="80px">
        <el-form-item label="接收者ID">
          <el-input v-model="receiverId" />
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input v-model="content" type="textarea" rows="5" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSend">发送</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.message-item {
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
}
</style>
