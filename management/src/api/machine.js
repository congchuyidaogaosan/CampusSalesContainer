import request from '@/utils/request'

export function getMachines(params) {
  return request({
    url: '/api/machines',
    method: 'get',
    params
  })
}

export function getMachine(id) {
  return request({
    url: `/api/machines/${id}`,
    method: 'get'
  })
}

export function createMachine(data) {
  return request({
    url: '/api/machines',
    method: 'post',
    data
  })
}

export function updateMachine(id, data) {
  return request({
    url: `/api/machines/${id}`,
    method: 'put',
    data
  })
}

export function deleteMachine(id) {
  return request({
    url: `/api/machines/${id}`,
    method: 'delete'
  })
}

export function getMachineStock(id) {
  return request({
    url: `/api/machines/${id}/stock`,
    method: 'get'
  })
}

export function controlMachine(id, action) {
  return request({
    url: `/api/machines/${id}/control`,
    method: 'post',
    data: { action }
  })
} 