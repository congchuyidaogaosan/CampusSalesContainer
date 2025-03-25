import request from '@/utils/request'

export function getOrders(params) {
  return request({
    url: '/api/orders',
    method: 'get',
    params
  })
}

export function getOrder(id) {
  return request({
    url: `/api/orders/${id}`,
    method: 'get'
  })
}

export function updateOrderStatus(id, status) {
  return request({
    url: `/api/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

export function handleRefund(id, approved) {
  return request({
    url: `/api/orders/${id}/refund`,
    method: 'post',
    data: { approved }
  })
} 