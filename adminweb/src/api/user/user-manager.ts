import request from '@/utils/request'

/**
 * 分页获取用户列表
 * @param page 页码
 * @param size 每页数量
 * @returns 用户分页列表
 */
export function getUserList(page: number, size: number) {
    return request({
        url: `/user/user-manager/users/${page}/${size}`,
        method: 'get'
    })
}

/**
 * 删除用户
 * @param id 用户ID
 * @returns 删除结果
 */
export function deleteUser(id: string) {
    return request({
        url: '/user/user-manager',
        method: 'delete',
        params: { id }
    })
}

/**
 * 获取用户的角色列表
 * @param id 用户ID
 * @returns 角色名称数组
 */
export function getUserRoles(id: string) {
    return request({
        url: '/user/user-manager/role',
        method: 'get',
        params: { id }
    })
}

/**
 * 获取用户的权限列表
 * @param id 用户ID
 * @returns 权限路径数组
 */
export function getUserPermissions(id: string) {
    return request({
        url: '/user/user-manager/permission',
        method: 'get',
        params: { id }
    })
}