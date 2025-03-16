const { userAPI } = require('../../services/api')

Page({
  data: {
    userInfo: {
      avatarUrl: 'https://example.com/default-avatar.png',
      nickName: '未登录',
    },
    isLogin: false,
    orderStats: {
      unpaid: 0,
      undelivered: 0,
      completed: 0
    },
    balance: 0,
    points: 0
  },

  onLoad() {
    this.checkLoginStatus()
    this.loadUserInfo()
  },

  async checkLoginStatus() {
    try {
      const token = wx.getStorageSync('token')
      if (token) {
        this.setData({ isLogin: true })
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  },

  async loadUserInfo() {
    if (!this.data.isLogin) return
    try {
      const userInfo = await userAPI.getUserInfo()
      this.setData({
        userInfo,
        balance: userInfo.balance,
        points: userInfo.points,
        orderStats: userInfo.orderStats
      })
    } catch (error) {
      wx.showToast({
        title: error.message || '获取用户信息失败',
        icon: 'none'
      })
    }
  },

  async onLogin() {
    try {
      // 获取用户信息
      const { userInfo } = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '用于完善会员资料',
          success: resolve,
          fail: reject
        })
      })

      // 获取登录code
      const { code } = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })

      // 调用登录接口
      const loginResult = await userAPI.login(code)
      wx.setStorageSync('token', loginResult.token)

      // 更新用户信息
      await userAPI.updateUserInfo(userInfo)

      this.setData({
        userInfo,
        isLogin: true
      })

      // 加载用户数据
      this.loadUserInfo()
    } catch (error) {
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
    }
  },

  navigateToOrders(e) {
    const { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order/order?type=${type}`
    })
  },

  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  contactService() {
    // TODO: 客服功能
  }
}) 