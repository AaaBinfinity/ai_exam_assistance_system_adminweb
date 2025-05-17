import request from '@/utils/request'

/**
 * 获取角色列表
 * @param page 页码
 * @param size 每页数量
 * @returns 角色分页列表
 */
export function getRoles(page?: number, size?: number) {
    return request({
        url: '/user/role-manager/roles',
        method: 'get',
        params: { page, size }
    })
}

/**
 * 获取权限列表
 * @param page 页码
 * @param size 每页数量
 * @returns 权限分页列表
 */
export function getPermissions(page?: number, size?: number) {
    return request({
        url: '/user/role-manager/permissions',
        method: 'get',
        params: { page, size }
    })
}

/**
 * 为用户分配角色
 * @param userId 用户ID
 * @param roleIds 角色ID数组
 * @returns 操作结果
 */
export function assignRoles(userId: string, roleIds: string[]) {
    return request({
        url: `/user/role-manager/role?userId=${userId}`,
        method: 'put',
        data: roleIds
    })
}

/**
 * 移除用户的角色
 * @param userId 用户ID
 * @param roleIds 要移除的角色ID数组
 * @returns 操作结果
 */
export function removeRoles(userId: string, roleIds: string[]) {
    return request({
        url: `/user/role-manager/role?userId=${userId}`,
        method: 'delete',
        data: roleIds
    })
}