<template>
  <div class="machine-container">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="售货柜编号/位置" clearable @keyup.enter.native="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="运行状态" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="故障" value="fault" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="operation-buttons">
        <el-button type="primary" @click="handleAdd">新增售货柜</el-button>
      </div>
    </div>

    <!-- 售货柜列表 -->
    <el-table v-loading="loading" :data="machines" border style="width: 100%">
      <el-table-column prop="machineId" label="售货柜ID" width="100" />
      <el-table-column prop="machineNumber" label="编号" width="120" />
      <el-table-column prop="machineLocation" label="位置" />
      <el-table-column prop="machineCapacity" label="容量" width="100" />
      <el-table-column prop="machineStatus" label="运行状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getMachineStatusType(scope.row.machineStatus)">
            {{ scope.row.machineStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <!-- <el-button type="text" @click="handleStock(scope.row)">库存</el-button> -->
          <el-button type="text" @click="handleControl(scope.row)">远程控制</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 售货柜表单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="machineForm" :model="machineForm" :rules="machineRules" label-width="100px">
        <el-form-item label="编号" prop="machineNumber">
          <el-input v-model="machineForm.machineNumber" />
        </el-form-item>
        <el-form-item label="位置" prop="machineLocation">
          <el-input v-model="machineForm.machineLocation" />
        </el-form-item>
        <el-form-item label="容量" prop="machineCapacity">
          <el-input-number v-model="machineForm.machineCapacity" :min="1" />
        </el-form-item>
        <el-form-item label="状态" prop="machineStatus">
          <el-select v-model="machineForm.machineStatus" placeholder="请选择状态">
            <el-option label="正常" value="正常" />
            <el-option label="故障" value="故障" />
            <el-option label="离线" value="离线" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 库存管理对话框 -->
    <el-dialog title="库存管理" :visible.sync="stockDialogVisible" width="800px">
      <div v-if="currentMachine" class="stock-manager">
        <div class="stock-info">
          <span>售货柜编号：{{ currentMachine.code }}</span>
          <span>位置：{{ currentMachine.location }}</span>
          <span>总容量：{{ currentMachine.capacity }}</span>
        </div>
        <el-table :data="stockList" border>
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="stock" label="当前库存" width="120" />
          <el-table-column label="补货" width="200">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.replenish" :min="0" :max="currentMachine.capacity - getTotalStock()"
                size="small" />
            </template>
          </el-table-column>
        </el-table>
        <div class="stock-actions">
          <el-button type="primary" @click="submitStock">确认补货</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 远程控制对话框 -->
    <el-dialog title="远程控制" :visible.sync="controlDialogVisible" width="400px">
      <div v-if="currentMachine" class="control-panel">
        <div class="machine-status">
          <p>当前状态：
            <el-tag :type="getMachineStatusType(currentMachine.machineStatus)">
              {{ currentMachine.machineStatus }}
            </el-tag>
          </p>
        </div>
        <div class="control-actions">
          <el-button type="success" 
            :disabled="currentMachine.machineStatus === '正常'"
            @click="updateMachineStatus('正常')">设为正常</el-button>
          <el-button type="warning" 
            :disabled="currentMachine.machineStatus === '故障'"
            @click="updateMachineStatus('故障')">设为故障</el-button>
          <el-button type="info" 
            :disabled="currentMachine.machineStatus === '离线'"
            @click="updateMachineStatus('离线')">设为离线</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMachines,
  getMachine,
  createMachine,
  updateMachine,
  deleteMachine,
  getMachineStock,
  controlMachine
} from '@/api/machine'

export default {
  name: 'Machine',
  data() {
    return {
      loading: false,
      machines: [],
      page: 1,
      limit: 10,
      total: 0,
      searchForm: {
        keyword: '',
        status: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      machineForm: {
        machineId: '',
        machineNumber: '',
        machineLocation: '',
        machineCapacity: 100,
        machineStatus: '正常'
      },
      machineRules: {
        machineNumber: [
          { required: true, message: '请输入售货柜编号', trigger: 'blur' }
        ],
        machineLocation: [
          { required: true, message: '请输入售货柜位置', trigger: 'blur' }
        ],
        machineCapacity: [
          { required: true, message: '请输入售货柜容量', trigger: 'blur' }
        ],
        machineStatus: [
          { required: true, message: '请选择售货柜状态', trigger: 'change' }
        ]
      },
      stockDialogVisible: false,
      controlDialogVisible: false,
      currentMachine: null,
      stockList: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const res = await getMachines({
          page: this.page,
          limit: this.limit,
          keyword: this.searchForm.keyword,
          status: this.searchForm.status
        })
        this.machines = res.data

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
    handleAdd() {
      this.dialogTitle = '新增售货柜'
      this.machineForm = {
        machineId: '',
        machineNumber: '',
        machineLocation: '',
        machineCapacity: 100,
        machineStatus: '正常'
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑售货柜'
      this.machineForm = { ...row }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该售货柜吗？', '提示', {
          type: 'warning'
        })
        await deleteMachine(row.machineId)
        this.$message.success('删除成功')
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    async submitForm() {
      try {
        await this.$refs.machineForm.validate()
        console.log(this.machineForm)
        if (this.machineForm.machineId) {
          await updateMachine( this.machineForm)
        } else {
          await createMachine(this.machineForm)
        }
        this.$message.success('保存成功')
        this.dialogVisible = false
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    async handleStock(row) {
      try {
        const res = await getMachineStock(row.id)
        this.currentMachine = row
        this.stockList = res.data.map(item => ({
          ...item,
          replenish: 0
        }))
        this.stockDialogVisible = true
      } catch (error) {
        console.error(error)
      }
    },
    getTotalStock() {
      return this.stockList.reduce((total, item) => total + item.stock, 0)
    },
    async submitStock() {
      try {
        const replenishData = this.stockList
          .filter(item => item.replenish > 0)
          .map(item => ({
            productId: item.id,
            quantity: item.replenish
          }))

        if (replenishData.length === 0) {
          this.$message.warning('请输入补货数量')
          return
        }

        await updateMachineStock(this.currentMachine.id, replenishData)
        this.$message.success('补货成功')
        this.stockDialogVisible = false
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    handleControl(row) {
      this.currentMachine = row
      this.controlDialogVisible = true
    },
    async updateMachineStatus(status) {
      try {
        await this.$confirm(`确认要将状态改为"${status}"吗？`, '提示', {
          type: 'warning'
        })
        this.currentMachine.machineStatus = status
        await updateMachine(this.currentMachine)
        this.$message.success('状态更新成功')
        this.controlDialogVisible = false
        this.loadData()
      } catch (error) {
        console.error(error)
      }
    },
    getMachineStatusType(status) {
      const types = {
        '正常': 'success',
        '故障': 'danger',
        '离线': 'info'
      }
      return types[status] || 'info'
    },
    getMachineStatusText(status) {
      const texts = {
        '正常': '正常',
        '故障': '故障',
        '离线': '离线'
      }
      return texts[status] || status
    },
    getActionText(action) {
      const texts = {
        open: '开门',
        reset: '重启',
        shutdown: '关机'
      }
      return texts[action] || action
    }
  }
}
</script>

<style lang="less" scoped>
.machine-container {
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

  .stock-manager {
    .stock-info {
      margin-bottom: 20px;

      span {
        margin-right: 20px;
      }
    }

    .stock-actions {
      margin-top: 20px;
      text-align: right;
    }
  }

  .control-panel {
    text-align: center;

    .machine-status {
      margin-bottom: 20px;
    }

    .control-actions {
      .el-button {
        margin: 0 10px;
      }
    }
  }
}
</style>