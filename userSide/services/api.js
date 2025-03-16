const BASE_URL = 'http://localhost:8081/api/'

// 添加请求拦截器
const requestInterceptor = (options) => {
  const token = wx.getStorageSync('token')
  if (token) {
    options.header = {
      ...options.header,
      'Authorization': `Bearer ${token}`
    }
  }
  return options
}

// 添加响应拦截器
const responseInterceptor = (response) => {
  if (response.statusCode === 401) {
    // token过期，清除登录状态
    wx.removeStorageSync('token')
    wx.redirectTo({
      url: '/pages/profile/profile'
    })
    throw new Error('登录已过期，请重新登录')
  }
  return response
}

// 修改request方法
const request = (url, options = {}) => {
  options = requestInterceptor(options)
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      ...options,
      success: (res) => {
        try {
          const response = responseInterceptor(res)
          if (response.statusCode === 200) {
            resolve(response.data)
          } else {
            reject(new Error(response.data.message || '请求失败'))
          }
        } catch (error) {
          reject(error)
        }
      },
      fail: reject
    })
  })
}

// 用户相关接口
const userAPI = {
  // 登录
  login: (code) => {
    return request('/user/login', {
      method: 'POST',
      data: { code }
    })
  },

  // 更新用户信息
  updateUserInfo: (userInfo) => {
    return request('/User/update', {
      method: 'POST',
      data: userInfo
    })
  },

  // 获取用户信息
  getUserInfo: () => {
    return request('/User/info')
  },

  // 获取用户设置
  getUserSettings: () => {
    return request('/User/settings')
  },

  // 更新用户设置
  updateSettings: (settings) => {
    return request('/User/settings', {
      method: 'PUT',
      data: settings
    })
  },

  // 退出登录
  logout: () => {
    return request('/User/logout', {
      method: 'POST'
    })
  }
}

// 商品相关接口
const productAPI = {
  // 获取分类列表
  getCategories: () => {
    return request('Type')
  },

  // 获取分类商品
  getCategoryProducts: (categoryId) => {
    return request(`/Type/${categoryId}/products`)
  },

  // 获取商品详情
  getProductDetail: (productId) => {
    return request(`/Product/${productId}`)
  },

  // 搜索商品
  searchProducts: (keyword) => {
    return request('/Product/search', {
      method: 'GET',
      data: { keyword }
    })
  }
}

// 订单相关接口
const orderAPI = {
  // 创建订单
  createOrder: (orderData) => {
    return request('/orders', {
      method: 'POST',
      data: orderData
    })
  },

  // 获取订单列表
  getOrders: (status) => {
    return request('/orders', {
      method: 'GET',
      data: { status }
    })
  },

  // 获取订单详情
  getOrderDetail: (orderId) => {
    return request(`/orders/${orderId}`)
  },

  // 取消订单
  cancelOrder: (orderId) => {
    return request(`/orders/${orderId}/cancel`, {
      method: 'POST'
    })
  }
}

// 购物车相关接口
const cartAPI = {
  // 获取购物车列表
  getCartItems: () => {
    return request('/cart')
  },

  // 添加到购物车
  addToCart: (productId, quantity) => {
    return request('/cart/add', {
      method: 'POST',
      data: { productId, quantity }
    })
  },

  // 更新购物车商品数量
  updateCartItem: (itemId, quantity) => {
    return request(`/cart/${itemId}`, {
      method: 'PUT',
      data: { quantity }
    })
  },

  // 删除购物车商品
  removeCartItem: (itemId) => {
    return request(`/cart/${itemId}`, {
      method: 'DELETE'
    })
  }
}

// 支付相关接口
const paymentAPI = {
  // 创建支付订单
  createPayment: (orderId) => {
    return request('/payments', {
      method: 'POST',
      data: { orderId }
    })
  }
}

module.exports = {
  userAPI,
  productAPI,
  orderAPI,
  cartAPI,
  paymentAPI
} 