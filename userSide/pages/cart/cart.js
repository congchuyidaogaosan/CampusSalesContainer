const { cartAPI } = require('../../services/api')

Page({
  data: {
    cartItems: [
      {
        id: 1,
        productId: 1,
        name: '可口可乐',
        price: 3.00,
        imageUrl: 'https://example.com/cola.jpg',
        quantity: 2,
        selected: true
      },
      {
        id: 2,
        productId: 2,
        name: '农夫山泉',
        price: 2.00,
        imageUrl: 'https://example.com/water.jpg',
        quantity: 1,
        selected: true
      }
    ],
    allSelected: true,
    totalPrice: 0
  },

  onLoad() {
    this.loadCartItems()
    this.calculateTotal()
  },

  async loadCartItems() {
    try {
      wx.showLoading({ title: '加载中' })
      const cartItems = await cartAPI.getCartItems()
      this.setData({ cartItems })
      this.calculateTotal()
    } catch (error) {
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  onItemSelect(e) {
    const { id } = e.currentTarget.dataset
    const { cartItems } = this.data
    const index = cartItems.findIndex(item => item.id === id)
    cartItems[index].selected = !cartItems[index].selected
    
    const allSelected = cartItems.every(item => item.selected)
    
    this.setData({ 
      cartItems,
      allSelected
    })
    
    this.calculateTotal()
  },

  onSelectAll() {
    const { cartItems, allSelected } = this.data
    const newCartItems = cartItems.map(item => ({
      ...item,
      selected: !allSelected
    }))
    
    this.setData({
      cartItems: newCartItems,
      allSelected: !allSelected
    })
    
    this.calculateTotal()
  },

  onQuantityChange(e) {
    const { id } = e.currentTarget.dataset
    const quantity = parseInt(e.detail.value)
    const { cartItems } = this.data
    const index = cartItems.findIndex(item => item.id === id)
    
    if (quantity > 0) {
      try {
        cartItems[index].quantity = quantity
        this.setData({ cartItems })
        await cartAPI.updateCartItem(id, quantity)
        this.calculateTotal()
      } catch (error) {
        wx.showToast({
          title: error.message || '更新失败',
          icon: 'none'
        })
        cartItems[index].quantity = this.data.cartItems[index].quantity
        this.setData({ cartItems })
      }
    }
  },

  async onDelete(e) {
    try {
      const { id } = e.currentTarget.dataset
      await cartAPI.removeCartItem(id)
      const { cartItems } = this.data
      const newCartItems = cartItems.filter(item => item.id !== id)
      this.setData({ cartItems: newCartItems })
      this.calculateTotal()
    } catch (error) {
      wx.showToast({
        title: error.message || '删除失败',
        icon: 'none'
      })
    }
  },

  calculateTotal() {
    const { cartItems } = this.data
    const totalPrice = cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0)
    
    this.setData({ totalPrice })
  },

  onCheckout() {
    const { cartItems } = this.data
    const selectedItems = cartItems.filter(item => item.selected)
    
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/payment/payment'
    })
  }
}) 