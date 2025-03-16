const { productAPI } = require('../../services/api')

Page({
  data: {
    categories: [
      {
        id: 1,
        name: '饮料',
        icon: 'https://example.com/drink.png'
      },
      {
        id: 2, 
        type: '零食',
        icon: 'https://example.com/snack.png'
      },
      {
        id: 3,
        type: '文具',
        icon: 'https://example.com/stationery.png'
      }
    ],
    products: [
      {
        id: 1,
        categoryId: 1,
        name: '可口可乐',
        price: 3.00,
        imageUrl: 'https://example.com/cola.jpg',
        stock: 10
      },
      {
        id: 2,
        categoryId: 1,
        name: '农夫山泉',
        price: 2.00,
        imageUrl: 'https://example.com/water.jpg',
        stock: 20
      }
    ],
    currentCategory: 1,
    searchValue: ''
  },

  onLoad() {
    this.loadData()
  },

  async loadData() {
    try {
      wx.showLoading({ title: '加载中' })
      await Promise.all([
        this.loadCategories(),
        this.loadProducts()
      ])
    } catch (error) {
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  async loadCategories() {
    const categories = await productAPI.getCategories()
    
    this.setData({ categories:categories.data })
  },

  async loadProducts(categoryId = this.data.currentCategory) {
    const products = await productAPI.getCategoryProducts(categoryId)
    this.setData({ products:products.data })
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentCategory: id })
    this.loadProducts(id)
  },

  onSearch(e) {
    const { value } = e.detail
    this.setData({ searchValue: value })
    if (value) {
      this.searchProducts(value)
    } else {
      this.loadProducts()
    }
  },

  onProductTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/product?id=${id}`
    })
  },

  async searchProducts(keyword) {
    try {
      const products = await productAPI.searchProducts(keyword)
      this.setData({ products })
    } catch (error) {
      wx.showToast({
        title: error.message || '搜索失败',
        icon: 'none'
      })
    }
  }
}) 