import request from '@/utils/request'

export function login(data) {
  console.log(data);
  
  return request({
    url: '/AdminLogin/login',
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
    url: '/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserList(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export function banUser(userId) {
  return request({
    url: `/users/${userId}/ban`,
    method: 'post'
  })
} 