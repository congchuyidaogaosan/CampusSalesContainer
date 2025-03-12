// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    banners: [
      {
        id: 1,
        imageUrl: 'https://example.com/banner1.jpg'
      },
      {
        id: 2,
        imageUrl: 'https://example.com/banner2.jpg'
      }
    ],
    locations: [
      {
        id: 1,
        name: '图书馆售货柜',
        address: '图书馆一楼大厅',
        distance: 100,
        imageUrl: 'https://example.com/location1.jpg'
      },
      {
        id: 2,
        name: '教学楼售货柜',
        address: '第一教学楼一楼',
        distance: 200,
        imageUrl: 'https://example.com/location2.jpg'
      }
    ],
    hotProducts: [
      {
        id: 1,
        name: '可口可乐',
        price: 3.00,
        imageUrl: 'https://example.com/product1.jpg'
      },
      {
        id: 2,
        name: '农夫山泉',
        price: 2.00,
        imageUrl: 'https://example.com/product2.jpg'
      }
    ]
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad() {
    this.loadBanners()
    this.loadLocations()
    this.loadHotProducts()
  },
  loadBanners() {
    // TODO: 从服务器获取轮播图数据
  },
  loadLocations() {
    // TODO: 从服务器获取售货柜位置数据
  },
  loadHotProducts() {
    // TODO: 从服务器获取热门商品数据
  },
  onTapSearch() {
    wx.navigateTo({
      url: '/pages/category/category'
    })
  },
  onTapBanner(e) {
    const { id } = e.currentTarget.dataset
    // TODO: 处理banner点击
  },
  onTapLocation(e) {
    const { id } = e.currentTarget.dataset
    // TODO: 跳转到对应售货柜的商品列表
  },
  onTapProduct(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/product?id=${id}`
    })
  }
})
