<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol';
}

#app {
  height: 100%;
  text-align: left;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.el-menu {
  border-right: none !important;
}

.el-menu-item {
  &.is-active {
    background-color: #1890ff !important;
    color: #fff !important;
  }
}

.app-container {
  padding: 20px;
}

.operation-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.form-container {
  width: 600px;
  margin: 0 auto;
  padding: 20px;

  .form-footer {
    margin-top: 20px;
    text-align: center;
  }
}

.el-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.chart-container {
  position: relative;
  width: 100%;
  height: 350px;
}

.status-tag {
  &.success {
    color: #67C23A;
    background: #f0f9eb;
    border-color: #c2e7b0;
  }
  
  &.warning {
    color: #E6A23C;
    background: #fdf6ec;
    border-color: #f5dab1;
  }
  
  &.danger {
    color: #F56C6C;
    background: #fef0f0;
    border-color: #fbc4c4;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
}
</style>
