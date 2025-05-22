import request from '@/utils/request'

export function getMachines(params) {
  return request({
    url: '/api/VendingMachine/list',
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
    url: '/api/VendingMachine/save',
    method: 'post',
    data
  })
}

export function updateMachine(data) {
  return request({
    url: `/api/VendingMachine/updateById`,
    method: 'post',
    data
  })
}

export function deleteMachine(id) {
  return request({
    url: `/api/VendingMachine/deleteById/${id}`,
    method: 'post'
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