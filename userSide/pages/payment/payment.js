const { orderAPI, paymentAPI } = require('../../services/api')

Page({
  data: {
    orderInfo: {
      orderId: '',
      orderNumber: '',
      orderTime: '',
      orderAmount: 0,
      items: []
    },
    loading: true
  },

  onLoad(options) {
    let info = wx.getStorageSync('info')
    if (info) {
      this.createOrder(info.data.userInfo.userId)
    }
  },

  async createOrder(userId) {
    try {
      wx.showLoading({ title: '创建订单中' })
      const order = await orderAPI.createOrder(userId)
      console.log('订单数据:', order)
      
      // 格式化订单数据
      const formattedOrder = {
        orderId: order.data.orderId,
        orderNumber: order.data.orderNumber,
        orderTime: this.formatTime(order.data.orderTime),
        orderAmount: order.data.orderAmount || 0,
        items: order.data.items || []
      }

      this.setData({ 
        orderInfo: formattedOrder,
        loading: false
      })
    } catch (error) {
      wx.showToast({
        title: error.message || '创建订单失败',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } finally {
      wx.hideLoading()
    }
  },

  formatTime(timestamp) {
    if (!timestamp) return ''
    const date = new Date(parseInt(timestamp))
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  },

  async onSubmit() {
    const { orderInfo } = this.data
    try {
      wx.showLoading({ title: '支付中' })
      console.log(orderInfo);
      // 调用支付接口
      const paymentResult = await paymentAPI.createPayment(orderInfo.orderId)
      
      // 模拟支付成功
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/order/order?id=${orderInfo.orderId}`
        })
      }, 1500)

    } catch (error) {
      wx.showToast({
        title: error.message || '支付失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  }
}) 