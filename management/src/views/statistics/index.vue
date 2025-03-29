<template>
  <div class="statistics-container">
    <!-- 时间范围选择 -->
    <!-- <div class="date-picker">
      <el-radio-group v-model="timeRange" @change="handleTimeRangeChange">
        <el-radio-button label="today">今日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="custom">自定义</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-show="timeRange === 'custom'"
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="loadData"
      />
    </div> -->

    <!-- 销售统计图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header">
            <span>销售额趋势</span>
          </div>
          <div class="chart-container" ref="salesChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">   
        <el-card class="chart-card">
          <div slot="header">
            <span>订单量趋势</span>
          </div>
          <div class="chart-container" ref="ordersChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品销售排行 -->
    <!-- <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>热销商品排行</span>
          </div>
          <div class="rank-list">
            <div 
              v-for="(item, index) in productRanking" 
              :key="item.id" 
              class="rank-item"
            >
              <div :class="['rank-number', index < 3 ? 'top' : '']">
                {{ index + 1 }}
              </div>
              <div class="rank-name">{{ item.name }}</div>
              <div class="rank-value">{{ item.sales }}件</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>销售额占比</span>
          </div>
          <div class="chart-container" ref="pieChart"></div>
        </el-card>
      </el-col>
    </el-row> -->

    <!-- 用户分析 -->
    <!-- <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header">
            <span>用户增长趋势</span>
          </div>
          <div class="chart-container" ref="userChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header">
            <span>用户活跃度分析</span>
          </div>
          <div class="chart-container" ref="userActivityChart"></div>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { 
  getSalesStats, 
  getOrderStats
} from '@/api/statistics'

export default {
  name: 'Statistics',
  data() {
    return {
      timeRange: 'today',
      dateRange: [],
      loading: false,
      charts: {},
      productRanking: []
    }
  },
  mounted() {
    this.initCharts()
    this.loadData()
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts)
    Object.values(this.charts).forEach(chart => {
      chart.dispose()
    })
  },
  methods: {
    initCharts() {
      // 初始化各个图表实例
      ['salesChart', 'ordersChart'].forEach(name => {
        this.charts[name] = echarts.init(this.$refs[name])
      })
    },
    resizeCharts() {
      Object.values(this.charts).forEach(chart => {
        chart.resize()
      })
    },
    async loadData() {
      try {
        this.loading = true
        // 加载各类统计数据
        const [salesData, orderData] = await Promise.all([
          getSalesStats(),  // 移除参数
          getOrderStats()   // 移除参数
        ])

        // 更新图表数据
        this.updateSalesChart(salesData.data)
        this.updateOrdersChart(orderData.data)
      } catch (error) {
        console.error(error)
        this.$message.error('加载统计数据失败')
      } finally {
        this.loading = false
      }
    },
    handleTimeRangeChange() {
      if (this.timeRange !== 'custom') {
        this.loadData()
      }
    },
    getDateRange() {
      // 根据选择的时间范围返回开始和结束日期
      const now = new Date()
      let start = new Date()
      let end = new Date()

      switch (this.timeRange) {
        case 'today':
          start.setHours(0, 0, 0, 0)
          break
        case 'week':
          start.setDate(now.getDate() - now.getDay())
          start.setHours(0, 0, 0, 0)
          break
        case 'month':
          start.setDate(1)
          start.setHours(0, 0, 0, 0)
          break
        case 'custom':
          if (this.dateRange && this.dateRange.length === 2) {
            [start, end] = this.dateRange
          }
          break
      }

      return {
        start: start.toISOString(),
        end: end.toISOString()
      }
    },
    // 更新各个图表的方法
    updateSalesChart(data) {
      const months = data.map(item => item.mother)
      const amounts = data.map(item => item.number)

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>{a}: ¥{c}'  // 添加货币符号
        },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '销售额',
          axisLabel: {
            formatter: '¥{value}'  // 添加货币符号
          }
        },
        series: [{
          name: '销售额',
          type: 'line',
          data: amounts,
          smooth: true,
          itemStyle: {
            color: '#67C23A'
          },
          label: {
            show: true,
            formatter: '¥{c}',  // 添加货币符号
            position: 'top'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(103,194,58,0.3)' },
              { offset: 1, color: 'rgba(103,194,58,0.1)' }
            ])
          }
        }]
      }

      this.charts.salesChart.setOption(option)
    },
    updateOrdersChart(data) {
      const months = data.map(item => item.mother)
      const numbers = data.map(item => item.number)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '订单数量',
          minInterval: 1
        },
        series: [{
          name: '订单数量',
          type: 'bar',
          data: numbers,
          itemStyle: {
            color: '#409EFF'
          },
          label: {
            show: true,
            position: 'top'
          }
        }]
      }

      this.charts.ordersChart.setOption(option)
    },
    updatePieChart(data) {
      const option = {
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'pie',
          radius: '50%',
          data: data.categories.map(item => ({
            name: item.name,
            value: item.amount
          }))
        }]
      }
      this.charts.pieChart.setOption(option)
    },
    updateUserChart(data) {
      // 实现用户增长趋势图表
    },
    updateUserActivityChart(data) {
      // 实现用户活跃度分析图表
    }
  }
}
</script>

<style lang="less" scoped>
.statistics-container {
  padding: 20px;

  .date-picker {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .chart-row {
    margin-bottom: 20px;
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
}
</style> 