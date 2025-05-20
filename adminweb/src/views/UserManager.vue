<template>
  <div class="user-manager">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
          v-model="searchKeyword"
          placeholder="请输入ID搜索"
          style="width: 300px; margin-right: 10px;"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
        :data="userList"
        border
        style="width: 100%; margin-top: 20px;"
        v-loading="loading"
    >
      <el-table-column prop="id" label="用户ID" width="180" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="realname" label="真实姓名" width="120" />
      <el-table-column prop="telephone" label="电话" width="150" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.enable === 1 ? 'success' : 'danger'">
            {{ row.enable === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="删除状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isDel === 1 ? 'info' : 'warning'">
            {{ row.isDel === 1 ? '未删除' : '已删除' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" @click="showUserRoles(row)">角色</el-button>
          <el-button size="small" @click="showUserPermissions(row)">权限</el-button>
          <el-popconfirm title="确认删除该用户吗？" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <PaginationBar
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @update:currentPage="currentPage = $event"
        @update:pageSize="pageSize = $event"
        @change="fetchUserList"
    />


    <!-- 用户角色对话框 -->
    <el-dialog v-model="roleDialogVisible" title="用户角色" width="30%">
      <el-table :data="currentUserRoles" border>
        <el-table-column prop="name" label="角色名称" />
      </el-table>
    </el-dialog>

    <!-- 用户权限对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="用户权限" width="40%">
      <el-table :data="currentUserPermissions" border>
        <el-table-column prop="path" label="权限路径" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { ElMessage } from 'element-plus'
import {
  getUserList,
  deleteUser,
  getUserRoles,
  getUserPermissions
} from '@/api/user/user-manager'

interface User {
  id: string
  username: string
  realname: string | null
  telephone: string | null
  email: string | null
  enable: number
  isDel: number
}

interface Role {
  name: string
}

interface Permission {
  path: string
}

// 状态管理
const userList = ref<User[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')

// 角色和权限弹窗
const roleDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const currentUserRoles = ref<Role[]>([])
const currentUserPermissions = ref<Permission[]>([])

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    const res = await getUserList(currentPage.value - 1, pageSize.value)
    userList.value = Array.isArray(res.data.content) ? res.data.content : []
    total.value = typeof res.data.totalElements === 'number' ? res.data.totalElements : 0
  } catch (error) {
    ElMessage.error('获取用户列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索操作
const handleSearch = () => {
  currentPage.value = 1
  fetchUserList()
}

// 删除用户
const handleDelete = async (id: string) => {
  try {
    await deleteUser(id)
    ElMessage.success('删除用户成功')
    fetchUserList()
  } catch (error) {
    ElMessage.error('删除用户失败')
    console.error(error)
  }
}

// 查看用户角色
const showUserRoles = async (user: User) => {
  try {
    const res = await getUserRoles(user.id)
    currentUserRoles.value = res.data.map((name: string) => ({ name }))
    roleDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取角色失败')
    console.error(error)
  }
}

// 查看用户权限
const showUserPermissions = async (user: User) => {
  try {
    const res = await getUserPermissions(user.id)
    currentUserPermissions.value = res.data.map((path: string) => ({ path }))
    permissionDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取权限失败')
    console.error(error)
  }
}

// 初始加载
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-manager {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
