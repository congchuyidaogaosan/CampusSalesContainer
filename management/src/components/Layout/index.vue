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
        <el-menu-item v-for="route in routes" :key="route.path" :index="route.path">
          <i :class="route.meta.icon"></i>
          <span slot="title">{{ route.meta.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
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
      
      <el-main>
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
    async logout() {
      try {
        await this.$store.dispatch('user/logout')
        this.$router.push('/login')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  height: 100vh;
}

.sidebar-container {
  background-color: #304156;
  .el-menu {
    border: none;
  }
}

.navbar {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .el-dropdown-link {
      cursor: pointer;
      color: #333;
    }
  }
}
</style> 