const { orderAPI } = require('../../services/api')

Page({
  data: {
    orders: [], // 改为数组存储订单列表
    loading: true
  },

  onLoad(options) {
    // const { id } = options
    this.loadOrderList()
  },

  async loadOrderList() {
    try {
      // 获取用户信息
      let info = wx.getStorageSync('info')
      console.log(info.data.userInfo.userId);
      
      const userId = info.data.userInfo.userId
      wx.showLoading({ title: '加载中' })
      const response = await orderAPI.getOrders(userId)
      
      // 格式化订单数据
      const formattedOrders = response.data.map(order => ({
        ...order,
        orderTime: this.formatTime(order.orderTime),
        statusClass: this.getStatusClass(order.payStatus)
      }))

      this.setData({ 
        orders: formattedOrders,
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

  formatTime(timestamp) {
    if (!timestamp) return ''
    const date = new Date(parseInt(timestamp))
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  },

  getStatusClass(status) {
    switch (status) {
      case '未支付':
        return 'unpaid'
      case '已支付':
        return 'paid'
      case '已完成':
        return 'completed'
      default:
        return ''
    }
  },

  async cancelOrder(e) {
    const orderId = e.currentTarget.dataset.id
    try {
      await orderAPI.cancelOrder(orderId)
      wx.showToast({
        title: '订单已取消',
        icon: 'success'
      })
      this.loadOrderList() // 重新加载订单列表
    } catch (error) {
      wx.showToast({
        title: error.message || '取消失败',
        icon: 'none'
      })
    }
  },

  repurchase(e) {
    const orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/payment/payment?orderId=${orderId}`
    })
  }
}) 