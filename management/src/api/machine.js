import request from '@/utils/request'

export function getMachines(params) {
  return request({
    url: '/api/VendingMachine',
    method: 'get',
    params
  })
}

export function getMachine(id) {
  return request({
    url: `/api/VendingMachine/${id}`,
    method: 'get'
  })
}

export function createMachine(data) {
  return request({
    url: '/api/VendingMachine',
    method: 'post',
    data
  })
}

export function updateMachine(id, data) {
  return request({
    url: `/api/VendingMachine/${id}`,
    method: 'put',
    data
  })
}

export function deleteMachine(id) {
  return request({
    url: `/api/VendingMachine/${id}`,
    method: 'delete'
  })
}

export function getMachineStock(id) {
  return request({
    url: `/api/VendingMachine/${id}/stock`,
    method: 'get'
  })
}

export function controlMachine(id, action) {
  return request({
    url: `/api/VendingMachine/${id}/control`,
    method: 'post',
    data: { action }
  })
} 