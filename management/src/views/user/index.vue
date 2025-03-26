<template>
  <div class="user-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="用户昵称/手机号" clearable @keyup.enter.native="handleSearch" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户列表 -->
    <el-table v-loading="loading" :data="users" border style="width: 100%">
      <el-table-column prop="openId" label="用户ID" width="80" />
      <el-table-column label="头像" width="80">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.userAvatar" />
        </template>
      </el-table-column>
      <el-table-column prop="userNickname" label="昵称" />
      <el-table-column prop="userPhone" label="手机号" width="120" />
      <el-table-column prop="userScore" label="余额" width="180" />
     
     
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
           
        </template>
      </el-table-column>
    </el-table>

     
    <!-- 用户详情对话框 -->
    <el-dialog title="用户详情" :visible.sync="detailVisible" width="600px">
      <div v-if="currentUser" class="user-detail">
        <div class="user-header">
          <el-avatar :size="80" :src="currentUser.avatar" />
          <div class="user-info">
            <h3>{{ currentUser.nickname }}</h3>
            <p>{{ currentUser.phone }}</p>
          </div>
        </div>
        <el-divider />
        <div class="detail-list">
          <div class="detail-item">
            <span class="label">注册时间：</span>
            <span>{{ currentUser.registerTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">最后登录：</span>
            <span>{{ currentUser.lastLoginTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">订单总数：</span>
            <span>{{ currentUser.orderCount }}</span>
          </div>
          <div class="detail-item">
            <span class="label">消费总额：</span>
            <span>¥{{ currentUser.totalSpent.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, banUser } from '@/api/user'

export default {
  name: 'User',
  data() {
    return {
      loading: false,
      users: [],
      page: 1,
      limit: 10,
      total: 0,
      searchForm: {
        keyword: '',
        status: ''
      },
      detailVisible: false,
      currentUser: null
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const res = await getUserList({
          page: this.page,
          limit: this.limit,
          keyword: this.searchForm.keyword,
          status: this.searchForm.status
        })
        this.users = res.data
      
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
        status: ''
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
    handleDetail(row) {
      this.currentUser = row
      this.detailVisible = true
    },
    async handleBan(row) {
      try {
        const action = row.status === 'normal' ? '封禁' : '解封'
        await this.$confirm(`确认要${action}该用户吗？`, '提示', {
          type: 'warning'
        })
        await banUser(row.id)
        this.$message.success(`${action}成功`)
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-container {
  padding: 20px;

  .search-bar {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .user-detail {
    .user-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .user-info {
        margin-left: 20px;

        h3 {
          margin: 0 0 10px;
        }

        p {
          margin: 0;
          color: #909399;
        }
      }
    }

    .detail-list {
      .detail-item {
        margin-bottom: 15px;

        .label {
          display: inline-block;
          width: 100px;
          color: #909399;
        }
      }
    }
  }

  .danger {
    color: #F56C6C;
  }
}
</style>