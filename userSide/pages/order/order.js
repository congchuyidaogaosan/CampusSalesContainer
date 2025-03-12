const { orderAPI } = require('../../services/api')

Page({
  data: {
    order: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options
    this.loadOrderDetail(id)
  },

  async loadOrderDetail(id) {
    try {
      wx.showLoading({ title: '加载中' })
      const order = await orderAPI.getOrderDetail(id)
      this.setData({ 
        order,
        loading: false
      })
    } catch (error) {
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  async cancelOrder() {
    const { order } = this.data
    try {
      await orderAPI.cancelOrder(order.id)
      wx.showToast({
        title: '订单已取消',
        icon: 'success'
      })
      // 重新加载订单详情
      this.loadOrderDetail(order.id)
    } catch (error) {
      wx.showToast({
        title: error.message || '取消失败',
        icon: 'none'
      })
    }
  },

  repurchase() {
    const { order } = this.data
    // 跳转到支付页面，带上商品信息
    wx.navigateTo({
      url: `/pages/payment/payment?productId=${order.items[0].productId}&quantity=${order.items[0].quantity}`
    })
  }
}) 