const { orderAPI, paymentAPI } = require('../../services/api')

Page({
  data: {
    orderInfo: {
      orderId: '',
      orderNumber: '',
      orderTime: '',
      orderAmount: 0,
      machineId: ''
    },
    loading: true,
    machines: [], // 添加售货柜列表
    selectedMachine: null // 添加选中的售货柜
  },

  onLoad(options) {
    const { orderId } = options
    if (orderId) {
      this.loadOrderDetail(orderId)
    } else {
      let info = wx.getStorageSync('info')
      if (info) {
        this.createOrder(info.data.userInfo.userId)
      }
    }
    // 加载附近的售货柜
    this.loadNearbyMachines()
  },

  // 加载附近售货柜
  async loadNearbyMachines() {
    try {
      const response = await orderAPI.getNearbyMachines()
      this.setData({
        machines: response.data
      })
    } catch (error) {
      wx.showToast({
        title: '获取售货柜失败',
        icon: 'none'
      })
    }
  },

  // 选择售货柜
  onMachineSelect(e) {
    const machineId = e.currentTarget.dataset.id
    this.setData({
      selectedMachine: this.data.machines.find(m => m.machineId === machineId)
    })
  },

  async loadOrderDetail(orderId) {
    try {
      wx.showLoading({ title: '加载中' })
      const response = await orderAPI.getOrderDetail(orderId)
      const order = response.data
      
      // 格式化订单数据
      const formattedOrder = {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        orderTime: this.formatTime(order.orderTime),
        orderAmount: order.orderAmount,
        machineId: order.machineId
      }

      this.setData({ 
        orderInfo: formattedOrder,
        loading: false
      })
    } catch (error) {
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } finally {
      wx.hideLoading()
    }
  },

  async createOrder(userId) {
    try {
      wx.showLoading({ title: '创建订单中' })
      const response = await orderAPI.createOrder(userId)
      const order = response.data
      
      // 格式化订单数据
      const formattedOrder = {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        orderTime: this.formatTime(order.orderTime),
        orderAmount: order.orderAmount,
        machineId: order.machineId
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
    const { orderInfo, selectedMachine } = this.data
    
    // 验证是否选择了售货柜
    if (!selectedMachine) {
      wx.showToast({
        title: '请选择取货柜',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '支付中' })
      
      // 更新订单的售货柜信息
      // await orderAPI.updateOrderMachine(orderInfo.orderId, selectedMachine.machineId)
      
      // 调用支付接口
      const paymentResult = await paymentAPI.createPayment(orderInfo.orderId,selectedMachine.machineId)
      
      // 支付成功
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/order/order`
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