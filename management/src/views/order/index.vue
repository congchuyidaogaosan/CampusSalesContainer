<template>
  <div class="order-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.orderNo" placeholder="订单编号" clearable @keyup.enter.native="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="订单状态" clearable>
            <el-option label="待支付" value="pending" />
            <el-option label="已支付" value="paid" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单列表 -->
    <el-table v-loading="loading" :data="orders" border style="width: 100%">
      <el-table-column prop="orderNumber" label="订单编号" width="180" />
      <el-table-column prop="orderTime  " label="下单时间" width="180" />
      <el-table-column prop="orderId" label="用户" />
      <el-table-column prop="amount" label="金额" width="120">
        <!-- <template slot-scope="scope">
          ¥{{ scope.row.amount.toFixed(2) }}
        </template> -->
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="getOrderStatusType(scope.row.payStatus)">
            {{ getOrderStatusText(scope.row.payStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status === 'pending'" type="text" @click="handleCancel(scope.row)">取消</el-button>
          <el-button v-if="scope.row.refundStatus === 'pending'" type="text"
            @click="handleRefund(scope.row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>

  

    <!-- 订单详情对话框 -->
    <!-- <el-dialog title="订单详情" :visible.sync="detailVisible" width="600px">
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-item">
          <span class="label">订单编号：</span>
          <span>{{ currentOrder.orderNo }}</span>
        </div>
        <div class="detail-item">
          <span class="label">下单时间：</span>
          <span>{{ currentOrder.createTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">用户信息：</span>
          <span>{{ currentOrder.userName }}</span>
        </div>
        <div class="detail-item">
          <span class="label">订单状态：</span>
          <el-tag :type="getOrderStatusType(currentOrder.status)">
            {{ getOrderStatusText(currentOrder.status) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">商品清单：</span>
        </div>
        <el-table :data="currentOrder.items" border>
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价" width="120">
            <template slot-scope="scope">
              ¥{{ scope.row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="120" />
          <el-table-column label="小计" width="120">
            <template slot-scope="scope">
              ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="detail-item total">
          <span class="label">订单总额：</span>
          <span class="amount">¥{{ currentOrder.amount.toFixed(2) }}</span>
        </div>
      </div>
    </el-dialog> -->

    <!-- 退款处理对话框 -->
    <!-- <el-dialog title="退款处理" :visible.sync="refundVisible" width="400px">
      <div class="refund-form">
        <p>确认处理此退款申请吗？</p>
        <div class="refund-actions">
          <el-button @click="refundVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmRefund(true)">同意退款</el-button>
          <el-button type="danger" @click="confirmRefund(false)">拒绝退款</el-button>
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { getOrders, getOrder, updateOrderStatus, handleRefund } from '@/api/order'

export default {
  name: 'Order',
  data() {
    return {
      loading: false,
      orders: [],
      page: 1,
      limit: 10,
      total: 0,
      searchForm: {
        orderNo: '',
        status: '',
        dateRange: []
      },
      detailVisible: false,
      refundVisible: false,
      currentOrder: null
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const { start, end } = this.formatDateRange()
        const res = await getOrders({
          page: this.page,
          limit: this.limit,
          orderNo: this.searchForm.orderNo,
          status: this.searchForm.status,
          startDate: start,
          endDate: end
        })
        this.orders = res.data

      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    formatDateRange() {
      if (!this.searchForm.dateRange || !this.searchForm.dateRange.length) {
        return { start: '', end: '' }
      }
      const [start, end] = this.searchForm.dateRange
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      }
    },
    handleSearch() {
      this.page = 1
      this.loadData()
    },
    resetSearch() {
      this.searchForm = {
        orderNo: '',
        status: '',
        dateRange: []
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
    async handleDetail(row) {
      try {
        const res = await getOrder(row.id)
        this.currentOrder = res.data
        this.detailVisible = true
      } catch (error) {
        console.error(error)
      }
    },
    async handleCancel(row) {
      try {
        await this.$confirm('确认取消该订单吗？', '提示', {
          type: 'warning'
        })
        await updateOrderStatus(row.id, 'cancelled')
        this.$message.success('订单已取消')
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    handleRefund(row) {
      this.currentOrder = row
      this.refundVisible = true
    },
    async confirmRefund(approved) {
      try {
        await handleRefund(this.currentOrder.id, approved)
        this.$message.success(approved ? '已同意退款' : '已拒绝退款')
        this.refundVisible = false
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    getOrderStatusType(status) {
      const types = {
        pending: 'warning',
        paid: 'success',
        completed: 'info',
        cancelled: 'danger'
      }
      return types[status] || 'info'
    },
    getOrderStatusText(status) {
      const texts = {
        pending: '待支付',
        paid: '已支付',
        completed: '已完成',
        cancelled: '已取消'
      }
      return texts[status] || status
    }
  }
}
</script>

<style lang="less" scoped>
.order-container {
  padding: 20px;

  .search-bar {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .order-detail {
    .detail-item {
      margin-bottom: 15px;

      .label {
        display: inline-block;
        width: 100px;
        color: #909399;
      }

      &.total {
        margin-top: 20px;
        text-align: right;

        .amount {
          font-size: 18px;
          color: #F56C6C;
          font-weight: bold;
        }
      }
    }
  }

  .refund-form {
    text-align: center;

    .refund-actions {
      margin-top: 20px;
    }
  }
}
</style>