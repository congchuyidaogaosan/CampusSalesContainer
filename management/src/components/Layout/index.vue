<template>
  <el-container class="app-wrapper">
    <el-aside width="200px" class="sidebar-container">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item 
          v-for="route in routes" 
          :key="route.path" 
          :index="route.path"
        >
          <i :class="getIcon(route.children[0].meta.icon)"></i>
          <span slot="title">{{ route.children[0].meta.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container class="main-container">
      <el-header height="50px" class="navbar">
        <div class="right-menu">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ name }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { routes } from '@/router'

export default {
  name: 'Layout',
  computed: {
    ...mapGetters(['name']),
    routes() {
      return routes.filter(route => !route.hidden)
    }
  },
  methods: {
    getIcon(icon) {
      const iconMap = {
        'dashboard': 'el-icon-s-home',
        'product': 'el-icon-goods',
        'order': 'el-icon-s-order',
        'machine': 'el-icon-s-platform',
        'user': 'el-icon-user',
        'statistics': 'el-icon-s-data'
      }
      return iconMap[icon] || 'el-icon-s-help'
    },
    async logout() {
      try {
        await this.$store.dispatch('user/logout')
        this.$router.push('/login')
      } catch (error) {
        console.error(error)
        this.$message.error(error.message || '退出失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
}

.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1001;
  background-color: #304156;
  overflow: hidden;

  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }
}

.main-container {
  min-height: 100%;
  margin-left: 200px;
  position: relative;
}

.navbar {
  position: relative;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;

  .right-menu {
    height: 100%;
    line-height: 50px;
    
    .el-dropdown-link {
      cursor: pointer;
      color: #333;
      font-size: 14px;

      .el-icon--right {
        margin-left: 8px;
      }
    }
  }
}

.app-main {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
  overflow-x: hidden;
}

// 菜单项样式
.el-menu-item {
  &.is-active {
    background-color: #1890ff !important;
    color: #fff !important;
  }

  i {
    margin-right: 10px;
    font-size: 18px;
    vertical-align: middle;
  }
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style> 