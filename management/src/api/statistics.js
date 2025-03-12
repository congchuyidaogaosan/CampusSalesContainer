import request from '@/utils/request'

export function getSalesStats(params) {
  return request({
    url: '/admin/statistics/sales',
    method: 'get',
    params
  })
}

export function getOrderStats(params) {
  return request({
    url: '/admin/statistics/orders',
    method: 'get',
    params
  })
}

export function getUserStats(params) {
  return request({
    url: '/admin/statistics/users',
    method: 'get',
    params
  })
}

export function getProductStats(params) {
  return request({
    url: '/admin/statistics/products',
    method: 'get',
    params
  })
} 