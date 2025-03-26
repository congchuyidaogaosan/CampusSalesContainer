import request from '@/utils/request'

export function getProducts(params) {
  return request({
    url: '/api/Product',
    method: 'get',
    params
  })
}

export function getProduct(id) {
  return request({
    url: `/api/Product/${id}`,
    method: 'get'
  })
}

export function createProduct(data) {
  return request({
    url: '/api/Product/save',
    method: 'post',
    data
  })
}

export function updateProduct(id, data) {
  return request({
    url: `/api/Product/updateById`,
    method: 'post',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: `/api/Product/deleteById/${id}`,
    method: 'post'
  })
}

export function getCategories() {
  return request({
    url: '/api/categories',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/api/categories/save',
    method: 'post',
    data
  })
}

export function updateCategory(id, data) {
  return request({
    url: `/api/categories/updateById`,
    method: 'post',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: `/api/categories/deleteById/${id}`,
    method: 'post'
  })
} 