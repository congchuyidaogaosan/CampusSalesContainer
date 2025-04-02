const { orderAPI } = require('../../services/api')

Page({
  data: {
    orders: [],
    loading: true,
    // 添加订单状态常量
    STATUS: {
      UNPAID: '未支付',
      UNDELIVERED: '未取货',
      COMPLETED: '已完成'
    }
  },

  onLoad(options) {
    // const { id } = options
    this.loadOrderList()
  },

  async loadOrderList() {
    try {
      let info = wx.getStorageSync('info')
      const userId = info.data.userInfo.userId
      wx.showLoading({ title: '加载中' })
      const response = await orderAPI.getOrders(userId)
      
      // 先按时间戳排序，再格式化数据
      const formattedOrders = response.data
        .sort((a, b) => {
          // 使用原始的orderTime时间戳进行排序
          return parseInt(b.orderTime) - parseInt(a.orderTime)
        })
        .map(order => ({
          ...order,
          orderTime: this.formatTime(order.orderTime),
          statusClass: this.getStatusClass(order.payStatus),
          statusText: this.getStatusText(order.payStatus),
          // 根据状态显示不同的操作按钮
          showPay: order.payStatus === this.data.STATUS.UNPAID,
          showCancel: order.payStatus === this.data.STATUS.UNPAID,
          showPickup: order.payStatus === this.data.STATUS.UNDELIVERED
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
    const { STATUS } = this.data
    switch (status) {
      case STATUS.UNPAID:
        return 'unpaid'
      case STATUS.UNDELIVERED:
        return 'undelivered'
      case STATUS.COMPLETED:
        return 'completed'
      default:
        return ''
    }
  },

  getStatusText(status) {
    const { STATUS } = this.data
    switch (status) {
      case STATUS.UNPAID:
        return '待支付'
      case STATUS.UNDELIVERED:
        return '待取货'
      case STATUS.COMPLETED:
        return '已完成'
      default:
        return status
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
    console.log(e);
    const orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/payment/payment?orderId=${orderId}`
    })
  },

  // 新增取货方法
  async pickupOrder(e) {
    const orderId = e.currentTarget.dataset.id
    try {
      await orderAPI.pickupOrder(orderId)
      wx.showToast({
        title: '取货成功',
        icon: 'success'
      })
      this.loadOrderList() // 重新加载订单列表
    } catch (error) {
      wx.showToast({
        title: error.message || '取货失败',
        icon: 'none'
      })
    }
  }
}) 