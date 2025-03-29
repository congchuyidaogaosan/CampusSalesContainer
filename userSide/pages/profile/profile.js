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
      const token = wx.getStorageSync('info')
      console.log(token)
      if (token) {
        this.setData({ isLogin: true })
      }
     
      console.log(token.data.userInfo)
      this.setData({
        userInfo:token.data.userInfo,
        balance: token.data.userInfo.userScore,
        points: token.data.userInfo.userPhone,
        avatarUrl: token.data.userInfo.userAvatar
      })

    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  },

  async loadUserInfo() {
    // if (!this.data.isLogin) return
    try {
      // const userInfo = await userAPI.getUserInfo()
 
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

  // 头像和昵称相关方法
  userInput(e) {
    console.log(e);
    // 更改为 e.target.value 来获取输入框的值
    let nickname = e.target.value;
    this.setData({
      userInfo: {
       ...this.data.userInfo,
        nickname: nickname
      }
    });
    // 更改本地用户信息
    getApp().globalData.userInfo = this.data.userInfo;
    console.log(getApp().globalData.userInfo);
  },

  onChooseAvatar(e) {
    this.setData({
      // 更新头像 userInfo.avatarUrl
      userInfo: {
        ...this.data.userInfo,
        avatarUrl: e.detail.avatarUrl
      }
    });
    // 更改本地用户信息
    getApp().globalData.userInfo = this.data.userInfo
    console.log(getApp().globalData.userInfo);

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