const { cartAPI } = require('../../services/api')

Page({
  data: {
    cartItems: [
    ],
    allSelected: true,
    totalPrice: 0
  },

  onShow: function () {
    this.loadCartItems()
    // this.calculateTotal()
  },

  async loadCartItems() {
    try {
      let info = wx.getStorageSync('info')

      wx.showLoading({ title: '加载中' })
      const cartItems = await cartAPI.getCartItems(info.data.userInfo.userId)
      const cartItems1= cartItems.data;
      if(cartItems1==null){
      }else{
        this.setData({cartItems: cartItems1})
      }

      console.log(this.data.cartItems)
      // this.calculateTotal()
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
    console.log(cartItems)
    const index = cartItems.findIndex(item => item.ProductId === id)
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

  async onQuantityChange(e) {
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
      let info = wx.getStorageSync('info')
     
      const { id } = e.currentTarget.dataset
      await cartAPI.removeCartItem(id, info.data.userInfo.userId)

      this.loadCartItems()


      // this.calculateTotal()
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
      .reduce((total, item) => total + item.product.productPrice * item.Num, 0)

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
  },

  // 添加减少数量方法
  async onQuantityMinus(e) {
    const { id } = e.currentTarget.dataset
    const { cartItems } = this.data
    const index = cartItems.findIndex(item => item.id === id)
    const quantity = cartItems[index].quantity - 1

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

  // 添加增加数量方法
  async onQuantityPlus(e) {
    const { id } = e.currentTarget.dataset
    const { cartItems } = this.data
    const index = cartItems.findIndex(item => item.id === id)
    const quantity = cartItems[index].quantity + 1

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
}) 