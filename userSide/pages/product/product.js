const { productAPI, cartAPI } = require('../../services/api')

Page({
  data: {
    product: {
      id: 1,
      name: '可口可乐',
      price: 3.00,
      imageUrl: 'https://example.com/cola.jpg',
      description: '冰镇可口可乐，透心凉心飞扬！',
      stock: 10,
      specs: '500ml',
      ingredients: '水、糖、二氧化碳、焦糖色、磷酸、咖啡因、天然香料'
    },
    quantity: 1
  },

  onLoad(options) {
    const { id } = options
    this.loadProductDetail(id)
  },

  async loadProductDetail(id) {
    try {
      wx.showLoading({ title: '加载中' })
      const product = await productAPI.getProductDetail(id)
      this.setData({ product })
    } catch (error) {
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  onQuantityChange(e) {
    const quantity = parseInt(e.detail.value)
    if (quantity > 0 && quantity <= this.data.product.stock) {
      this.setData({ quantity })
    }
  },

  async addToCart() {
    try {
      const { product, quantity } = this.data
      await cartAPI.addToCart(product.id, quantity)
      wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    } catch (error) {
      wx.showToast({
        title: error.message || '添加失败',
        icon: 'none'
      })
    }
  },

  buyNow() {
    const { product, quantity } = this.data
    wx.navigateTo({
      url: `/pages/payment/payment?productId=${product.id}&quantity=${quantity}`
    })
  }
}) 