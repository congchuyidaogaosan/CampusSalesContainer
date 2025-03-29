import request from '@/utils/request'

export function getSalesStats() {
  return request({
    url: '/eacher/orderpriceeacher',
    method: 'get',
  })
}

export function getOrderStats() {
  return request({
    url: '/eacher/ordereacher',
    method: 'get',
  })
}

export function getUserStats(params) {
  return request({
    url: '/api/statistics/users',
    method: 'get',
    params
  })
}

export function getProductStats(params) {
  return request({
    url: '/api/statistics/products',
    method: 'get',
    params
  })
} 