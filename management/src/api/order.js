import request from '@/utils/request'

export function getOrders(params) {
  return request({
    url: '/admin/orders',
    method: 'get',
    params
  })
}

export function getOrder(id) {
  return request({
    url: `/admin/orders/${id}`,
    method: 'get'
  })
}

export function updateOrderStatus(id, status) {
  return request({
    url: `/admin/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

export function handleRefund(id, approved) {
  return request({
    url: `/admin/orders/${id}/refund`,
    method: 'post',
    data: { approved }
  })
} 