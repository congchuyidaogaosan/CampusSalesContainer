const { orderAPI, paymentAPI } = require('../../services/api')

Page({
  data: {
    orderInfo: null,
    loading: true
  },

  onLoad(options) {
    let info = wx.getStorageSync('info')
   

      this.createOrder(info.data.userInfo.userId)

  },

  async createOrder(userId) {
    try {
      wx.showLoading({ title: '创建订单中' })
      // const orderData = {
      //   items: [{
      //     productId,
      //     quantity: parseInt(quantity)
      //   }]
      // }
      const order = await orderAPI.createOrder(userId)
      this.setData({ 
        orderInfo: order,
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

  async onSubmit() {
    const { orderInfo } = this.data
    try {
      wx.showLoading({ title: '支付中' })
      const paymentResult = await paymentAPI.createPayment(orderInfo.id)
      
      // 调用微信支付
      await new Promise((resolve, reject) => {
        wx.requestPayment({
          ...paymentResult,
          success: resolve,
          fail: reject
        })
      })

      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/order/order?id=${orderInfo.id}`
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