<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view />
      <a-drawer
        title="偏好设置"
        placement="right"
        :closable="false"
        :visible="visible"
      >
        <ul class="settings-list">
          <li>
            <span>夜间模式</span>
            <a-switch v-model="isDark" checked-children="开" un-checked-children="关" @change="changeDark" />
          </li>
        </ul>
        <div slot="handle" class="button" @click="handleShowDrawer">
          <a-icon :type="!visible ? 'setting' : 'close'" />
        </div>
      </a-drawer>
    </div>
  </a-config-provider>
</template>
<script>
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data() {
    return {
      zh_CN,
      visible: false,
      isDark: getItem('dark') === 'dark'
    }
  },
  computed: {
    ...mapState({
      dark: state => state.settings.dark !== 'light'
    })
  },
  methods: {
    handleShowDrawer() {
      this.visible = !this.visible
    },
    changeDark(val) {
      const isDark = val ? 'dark' : 'light'
      this.$store.commit('settings/SET_STATE', { key: 'dark', value: isDark })
    }
  }
}
</script>
<style lang="less" scoped>
.settings-list{
  li{
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }
}
.button{
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 256px;
  top: 240px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  color: #fff;
  background-color: #1890ff;
}
</style>
