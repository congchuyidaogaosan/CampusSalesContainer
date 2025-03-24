import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  }).then(response => {
    if (response.code === 200) {
      return response.data
    }
    throw new Error(response.message || '登录失败')
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getUserList(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params
  })
}

export function banUser(userId) {
  return request({
    url: `/admin/users/${userId}/ban`,
    method: 'post'
  })
} 