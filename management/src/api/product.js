import request from '@/utils/request'

export function getProducts(params) {
  return request({
    url: '/admin/products',
    method: 'get',
    params
  })
}

export function getProduct(id) {
  return request({
    url: `/admin/products/${id}`,
    method: 'get'
  })
}

export function createProduct(data) {
  return request({
    url: '/admin/products',
    method: 'post',
    data
  })
}

export function updateProduct(id, data) {
  return request({
    url: `/admin/products/${id}`,
    method: 'put',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: `/admin/products/${id}`,
    method: 'delete'
  })
}

export function getCategories() {
  return request({
    url: '/admin/categories',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/admin/categories',
    method: 'post',
    data
  })
}

export function updateCategory(id, data) {
  return request({
    url: `/admin/categories/${id}`,
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: `/admin/categories/${id}`,
    method: 'delete'
  })
} 