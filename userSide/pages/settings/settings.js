const { userAPI } = require('../../services/api')

Page({
  data: {
    notificationEnabled: true,
    soundEnabled: true,
    loading: true
  },

  async onLoad() {
    await this.loadSettings()
  },

  async loadSettings() {
    try {
      wx.showLoading({ title: '加载中' })
      const settings = await userAPI.getUserSettings()
      this.setData({ 
        notificationEnabled: settings.notificationEnabled,
        soundEnabled: settings.soundEnabled,
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

  async onNotificationChange(e) {
    try {
      const notificationEnabled = e.detail.value
      await userAPI.updateSettings({ notificationEnabled })
      this.setData({ notificationEnabled })
    } catch (error) {
      wx.showToast({
        title: error.message || '设置失败',
        icon: 'none'
      })
      // 恢复原值
      this.setData({ notificationEnabled: !e.detail.value })
    }
  },

  async onSoundChange(e) {
    try {
      const soundEnabled = e.detail.value
      await userAPI.updateSettings({ soundEnabled })
      this.setData({ soundEnabled })
    } catch (error) {
      wx.showToast({
        title: error.message || '设置失败',
        icon: 'none'
      })
      // 恢复原值
      this.setData({ soundEnabled: !e.detail.value })
    }
  },

  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '清除中...'
          })
          // TODO: 清除缓存
          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: '清除成功',
              icon: 'success'
            })
          }, 1500)
        }
      }
    })
  },

  async logout() {
    try {
      await userAPI.logout()
      wx.removeStorageSync('token')
      wx.reLaunch({
        url: '/pages/profile/profile'
      })
    } catch (error) {
      wx.showToast({
        title: error.message || '退出失败',
        icon: 'none'
      })
    }
  }
}) 