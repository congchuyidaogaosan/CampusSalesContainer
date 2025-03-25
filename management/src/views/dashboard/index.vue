<template>
  <div class="dashboard-container">
    <!-- 数据概览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <div class="data-icon sales">
              <i class="el-icon-money"></i>
            </div>
            <div class="data-info">
              <div class="data-title">今日销售额</div>
              <div class="data-value">¥{{ todayStats.sales }}</div>
              <div class="data-compare">
                较昨日
                <span :class="todayStats.salesGrowth >= 0 ? 'up' : 'down'">
                  {{ Math.abs(todayStats.salesGrowth) }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <div class="data-icon orders">
              <i class="el-icon-s-order"></i>
            </div>
            <div class="data-info">
              <div class="data-title">今日订单数</div>
              <div class="data-value">{{ todayStats.orders }}</div>
              <div class="data-compare">
                较昨日
                <span :class="todayStats.ordersGrowth >= 0 ? 'up' : 'down'">
                  {{ Math.abs(todayStats.ordersGrowth) }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <div class="data-icon users">
              <i class="el-icon-user"></i>
            </div>
            <div class="data-info">
              <div class="data-title">今日新增用户</div>
              <div class="data-value">{{ todayStats.newUsers }}</div>
              <div class="data-compare">
                较昨日
                <span :class="todayStats.newUsersGrowth >= 0 ? 'up' : 'down'">
                  {{ Math.abs(todayStats.newUsersGrowth) }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <div class="data-icon profit">
              <i class="el-icon-wallet"></i>
            </div>
            <div class="data-info">
              <div class="data-title">今日利润</div>
              <div class="data-value">¥{{ todayStats.profit }}</div>
              <div class="data-compare">
                较昨日
                <span :class="todayStats.profitGrowth >= 0 ? 'up' : 'down'">
                  {{ Math.abs(todayStats.profitGrowth) }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <div slot="header">
            <span>销售趋势</span>
            <el-radio-group v-model="salesChartType" size="small">
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container">
            <v-chart :options="salesChartOption" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <div slot="header">
            <span>商品销量排行</span>
          </div>
          <div class="rank-list">
            <div v-for="(item, index) in productRanking" :key="item.id" class="rank-item">
              <span class="rank-number" :class="index < 3 ? 'top' : ''">{{ index + 1 }}</span>
              <span class="rank-name">{{ item.name }}</span>
              <span class="rank-value">{{ item.sales }}件</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新订单 -->
    <el-card class="latest-orders">
      <div slot="header">
        <span>最新订单</span>
        <el-button style="float: right" type="text" @click="viewAllOrders">
          查看全部
        </el-button>
      </div>
      <el-table :data="latestOrders" style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column prop="userName" label="用户" />
        <el-table-column prop="amount" label="金额" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getOrderStatusType(scope.row.status)">
              {{ getOrderStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getSalesStats, getOrderStats, getUserStats, getProductStats } from '@/api/statistics'
import echarts from 'echarts'

export default {
  name: 'Dashboard',
  data() {
    return {
      todayStats: {
        sales: 0,
        salesGrowth: 0,
        orders: 0,
        ordersGrowth: 0,
        newUsers: 0,
        newUsersGrowth: 0,
        profit: 0,
        profitGrowth: 0
      },
      salesChartType: 'week',
      salesChartOption: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      productRanking: [],
      latestOrders: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const [salesData, orderData, userData, productData] = await Promise.all([
          getSalesStats(),
          getOrderStats(),
          getUserStats(),
          getProductStats()
        ])

        // 更新今日数据统计
        this.todayStats = {
          sales: salesData.today.total,
          salesGrowth: salesData.today.growth,
          orders: orderData.today.total,
          ordersGrowth: orderData.today.growth,
          newUsers: userData.today.total,
          newUsersGrowth: userData.today.growth,
          profit: salesData.today.profit,
          profitGrowth: salesData.today.profitGrowth
        }

        // 更新销售趋势图表
        this.updateSalesChart(salesData.trend)

        // 更新商品排行
        this.productRanking = productData.ranking

        // 更新最新订单
        this.latestOrders = orderData.latest
      } catch (error) {
        console.error(error)
      }
    },
    updateSalesChart(data) {
      this.salesChartOption = {
        ...this.salesChartOption,
        xAxis: {
          data: data.map(item => item.date)
        },
        series: [{
          data: data.map(item => item.sales),
          type: 'line',
          smooth: true
        }]
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
    },
    viewAllOrders() {
      this.$router.push('/order')
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;

  .el-row {
    margin-bottom: 20px;
  }

  .data-item {
    display: flex;
    align-items: center;

    .data-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;

      i {
        font-size: 40px;
        color: #fff;
      }

      &.sales {
        background-color: #409EFF;
      }

      &.orders {
        background-color: #67C23A;
      }

      &.users {
        background-color: #E6A23C;
      }

      &.profit {
        background-color: #F56C6C;
      }
    }

    .data-info {
      .data-title {
        font-size: 14px;
        color: #909399;
      }

      .data-value {
        font-size: 24px;
        font-weight: bold;
        margin: 8px 0;
      }

      .data-compare {
        font-size: 12px;
        color: #909399;

        .up {
          color: #67C23A;
        }

        .down {
          color: #F56C6C;
        }
      }
    }
  }

  .chart-row {
    margin-top: 20px;
  }

  .chart-card {
    .chart-container {
      height: 350px;
    }
  }

  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #EBEEF5;

      &:last-child {
        border-bottom: none;
      }

      .rank-number {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #F2F6FC;
        border-radius: 50%;
        margin-right: 10px;

        &.top {
          background: #409EFF;
          color: #fff;
        }
      }

      .rank-name {
        flex: 1;
      }

      .rank-value {
        color: #909399;
      }
    }
  }

  .latest-orders {
    margin-top: 20px;
  }
}
</style>