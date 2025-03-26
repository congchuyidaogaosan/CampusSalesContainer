<template>
  <div class="product-container">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="商品名称/编号" clearable @keyup.enter.native="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.categoryId" placeholder="商品分类" clearable>
            <el-option v-for="item in categories" :key="item.type" :label="item.type" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="operation-buttons">
        <el-button type="primary" @click="handleAdd">新增商品</el-button>
        <el-button type="primary" @click="showCategoryDialog">分类管理</el-button>
      </div>
    </div>

    <!-- 商品列表 -->
    <el-table v-loading="loading" :data="products" border style="width: 100%">
      <el-table-column prop="productId" label="商品ID" width="80" />
      <el-table-column label="商品图片" width="100">
        <template slot-scope="scope">
          <el-image :src="scope.row.productImage" :preview-src-list="[scope.row.productImage]"
            style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="productDescription" label="商品名称" />
      <el-table-column prop="productCategory" label="分类" width="120" />
      <el-table-column prop="productPrice" label="价格" width="120">
        <template slot-scope="scope">
          ¥{{ scope.row.productPrice.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="productStock" label="库存" width="120">
        <template slot-scope="scope">
          <span :class="{ 'low-stock': scope.row.stock < scope.row.stockWarning }">
            {{ scope.row.productStock }}
          </span>
        </template>
      </el-table-column>
       
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    

    <!-- 商品表单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form ref="productForm" :model="productForm" :rules="productRules" label-width="100px">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="productForm.productName" />
        </el-form-item>
        <el-form-item label="商品分类" prop="productCategory">
          <el-select v-model="productForm.productCategory" placeholder="请选择分类">
            <el-option v-for="item in categories" :key="item.type" :label="item.type" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" prop="imageUrl">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
            :on-success="handleUploadSuccess" :before-upload="beforeUpload">
            <img v-if="productForm.productImage" :src="productForm.productImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="productForm.productPrice" :precision="2" :step="0.1" :min="0" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="productForm.productStock" :min="0" :step="1" />
        </el-form-item>
        
        <el-form-item label="商品描述" prop="productDescription">
          <el-input v-model="productForm.productDescription" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分类管理对话框 -->
    <el-dialog title="分类管理" :visible.sync="categoryDialogVisible" width="500px">
      <div class="category-list">
        <el-table :data="categories" border style="width: 100%">
          <el-table-column prop="type" label="分类名称" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEditCategory(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDeleteCategory(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="handleAddCategory">新增分类</el-button>
      </div>
    </el-dialog>

    <!-- 分类表单对话框 -->
    <el-dialog :title="categoryDialogTitle" :visible.sync="categoryFormVisible" width="400px">
      <el-form ref="categoryForm" :model="categoryForm" :rules="categoryRules" label-width="80px">
        <el-form-item label="分类名称" prop="type">
          <el-input v-model="categoryForm.type" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="categoryFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCategoryForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/api/product'

export default {
  name: 'Product',
  data() {
    return {
      // 搜索表单
      searchForm: {
        keyword: '',
        categoryId: ''
      },
      // 商品列表
      products: [],
      loading: false,
      // 分页
      page: 1,
      limit: 10,
      total: 0,
      // 分类列表
      categories: [],
      // 商品对话框
      dialogVisible: false,
      dialogTitle: '',
      productForm: {
        name: '',
        categoryId: '',
        imageUrl: '',
        price: 0,
        stock: 0,
        stockWarning: 10,
        description: ''
      },
      productRules: { },
      // 分类对话框
      categoryDialogVisible: false,
      categoryFormVisible: false,
      categoryDialogTitle: '',
      categoryForm: {
        name: ''
      },
      categoryRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 上传相关
      uploadUrl: process.env.VUE_APP_BASE_API + '/admin/upload'
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts({
            page: this.page,
            limit: this.limit,
            ...this.searchForm
          }),
          getCategories()
        ])
        this.products = productsRes.data
        console.log(productsRes)
     
        this.categories = categoriesRes.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.page = 1
      this.loadData()
    },
    resetSearch() {
      this.searchForm = {
        keyword: '',
        categoryId: ''
      }
      this.handleSearch()
    },
    handleSizeChange(val) {
      this.limit = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.page = val
      this.loadData()
    },
    handleAdd() {
      this.dialogTitle = '新增商品'
      this.productForm = {
        name: '',
        categoryId: '',
        imageUrl: '',
        price: 0,
        stock: 0,
        stockWarning: 10,
        description: ''
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑商品'
      this.productForm = { ...row }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该商品吗？', '提示', {
          type: 'warning'
        })
        await deleteProduct(row.productId)
        this.$message.success('删除成功')
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    async handleStatusChange(row) {
      try {
        await updateProduct(row.productId, { status: row.status })
        this.$message.success('状态更新成功')
      } catch (error) {
        row.status = row.status === 1 ? 0 : 1
        console.error(error)
      }
    },
    async submitForm() {
      try {
        await this.$refs.productForm.validate()
        if (this.productForm.productId) {
          await updateProduct(this.productForm.productId, this.productForm)
        } else {
          await createProduct(this.productForm)
        }
        this.$message.success('保存成功')
        this.dialogVisible = false
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    // 分类相关方法
    showCategoryDialog() {
      this.categoryDialogVisible = true
    },
    handleAddCategory() {
      this.categoryDialogTitle = '新增分类'
      this.categoryForm = { name: '' }
      this.categoryFormVisible = true
    },
    handleEditCategory(row) {
      this.categoryDialogTitle = '编辑分类'
      this.categoryForm = { ...row }
      this.categoryFormVisible = true
    },
    async handleDeleteCategory(row) {
      try {
        await this.$confirm('确认删除该分类吗？', '提示', {
          type: 'warning'
        })
        await deleteCategory(row.id)
        this.$message.success('删除成功')
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    async submitCategoryForm() {
      try {
        await this.$refs.categoryForm.validate()
        if (this.categoryForm.id) {
          await updateCategory(this.categoryForm.id, this.categoryForm)
        } else {
          await createCategory(this.categoryForm)
        }
        this.$message.success('保存成功')
        this.categoryFormVisible = false
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    // 上传相关方法
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },
    handleUploadSuccess(res) {
      this.productForm.imageUrl = res.data.url
    }
  }
}
</script>

<style lang="less" scoped>
.product-container {
  padding: 20px;

  .operation-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .low-stock {
    color: #F56C6C;
  }
}
</style>