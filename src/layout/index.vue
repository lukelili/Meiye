<template>
  <a-layout class="layout">
    <!-- aside -->
    <a-layout-sider v-model="collapsed" :theme="dark" class="aside" :trigger="null" collapsible>
      <div class="logo">纤指妆容会所</div>
      <a-menu mode="inline" class="menu" :theme="dark" :default-selected-keys="[`${currentRoute[1].path}`]" :default-open-keys="[`${currentRoute[0].path}`]" @click="handleMenuItem">
        <a-sub-menu v-for="route in routes" :key="route.path">
          <span slot="title"><a-icon :type="route.icon" /><span>{{ route.name }}</span></span>
          <template v-if="route.children && route.children.length">
            <a-menu-item v-for="child in route.children" :key="child.path">
              {{ child.name }}
            </a-menu-item>
          </template>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <!-- main -->
    <a-layout class="main">
      <a-layout-header class="header">
        <div class="left">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
          <a-breadcrumb>
            <template v-for="(item, index) in currentRoute">
              <a-breadcrumb-item :key="item.path">
                <router-link v-if="index != 0" :to="{ path: item.path === '' ? '/' : item.path }">{{ item.name }}</router-link>
                <span v-else>{{ item.name }}</span>
              </a-breadcrumb-item>
            </template>
          </a-breadcrumb>
        </div>
        <div class="right">
          <div class="user" />
        </div>
      </a-layout-header>
      <div class="line-nav">
        <div class="nav-item">首页</div>
      </div>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      collapsed: false,
      routes: this.$router.options.routes,
      currentRoute: this.$route.matched
    }
  },
  computed: {
    ...mapState({
      dark: state => state.settings.dark
    })
  },
  watch: {
    '$route'(route) {
      console.log(route.matched)
      this.currentRoute = route.matched
    }
  },
  mounted() {
    console.log(this.dark)
  },
  methods: {
    handleMenuItem(item) {
      this.$router.push({ path: item.key })
    }
  }
}
</script>
<style lang="less" scoped>
.layout{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  // 左栏
  .aside{
    .logo {
      height: 32px;
      margin: 9px 16px;
      line-height: 32px;
      border-radius: 4px;
      text-align: center;
      background: pink;
      color: #fff;
    }
    .menu{
      border-right: none;
      /deep/.ant-menu-submenu-title{
        text-align: left;
      }
      /deep/.ant-menu-item{
        text-align: left;
      }
    }
  }
  // 主体
  .main{
    display: flex;
    flex-direction: column;
    .header{
      height: 50px;
      display: flex;
      justify-content: space-between;
      padding-left: 0;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      .left{
        display: flex;
        align-items: center;
        font-size: 0;
        .trigger {
          font-size: 18px;
          padding: 16px 16px;
          cursor: pointer;
          transition: color 0.3s;
          &:hover{
            color: #1890ff;
          }
        }
      }
    }
    .line-nav{
      height: 40px;
      padding: 4px;
      display: flex;
      background-color: #fff;
      .nav-item{
        display: flex;
        align-items: center;
        padding: 4px 10px;
        border: 1px solid #eee;
      }
    }
    .content{
      flex: 1;
    }
  }
}
</style>
