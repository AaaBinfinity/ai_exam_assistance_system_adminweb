    /**
     * token 工具函数
     * 用于设置、获取、删除用户的 token
     */

    // 设置 token
    // 将 token 存储到 localStorage 中
    export const setToken = (token: string) => {
        localStorage.setItem('authToken', token)  // 使用 localStorage 保存 token
    }

    // 获取 token
    // 从 localStorage 中获取 token
    export const getToken = (): string | null => {
        return localStorage.getItem('authToken')  // 获取存储在 localStorage 中的 token
    }

    // 删除 token
    // 清除 localStorage 中的 token
    export const removeToken = () => {
        localStorage.removeItem('authToken')  // 从 localStorage 删除 token
    }

    /**
     * 用户信息工具函数
     * 用于设置、获取、删除用户信息
     */

    // 设置用户信息
    // 将用户信息保存到 localStorage 中（用户信息如用户名、角色等）
    export const setUserInfo = (userInfo: object) => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))  // 将用户信息转换为 JSON 字符串存储
    }

    // 获取用户信息
    // 从 localStorage 中获取存储的用户信息
    export const getUserInfo = (): object | null => {
        const userInfo = localStorage.getItem('userInfo')  // 获取存储的用户信息
        return userInfo ? JSON.parse(userInfo) : null  // 解析并返回用户信息，若无则返回 null
    }

    // 删除用户信息
    // 清除 localStorage 中的用户信息
    export const removeUserInfo = () => {
        localStorage.removeItem('userInfo')  // 删除存储在 localStorage 中的用户信息
    }
