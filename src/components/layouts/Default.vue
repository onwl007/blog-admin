<template>
  <Layout class="app-container">
    <Sider class="app-sider" hidden-trigger collapsible :collapsed-width="78">
      <div class="profile">
        <div class="user">
          <img
            class="avatar"
            src="../../../public/img/icons/android-chrome-192x192.png"
          />
          <h2 class="name">name</h2>
          <p class="slogan">Hello World</p>
        </div>
        <div class="action">
          <router-link
            class="notification"
            :to="{ name: 'Notification', query: { viewed: false } }"
          >
            <Badge :count="10">
              <Icon type="md-notifications" size="18" color="#fff" />
            </Badge>
          </router-link>
          <router-link class="info" :to="{ name: 'Auth' }">
            <Icon type="md-person" size="18" color="#fff" />
          </router-link>
          <a class="logout" @click="handleLogout">
            <Icon type="md-log-out" size="18" color="#fff" />
          </a>
        </div>
      </div>
      <Menu
        class="menu"
        :active-name="$route.name"
        theme="dark"
        width="auto"
        @on-select="menuClick"
      >
        <template v-for="menu in routeMenus">
          <Submenu
            class="menu-link"
            :name="menu.name"
            :key="menu.name"
            v-if="menu.children && menu.children.length"
          >
            <template slot="title">
              <Icon :type="menu.meta.icon" v-if="menu.meta.icon" />
              <span>{{ menu.meta.title }}</span>
            </template>
            <MenuItem
              class="sub-menu-link"
              :name="submenu.name"
              v-for="submenu in menu.children"
              :key="submenu.name"
            >
              <Icon :type="submenu.meta.icon" v-if="submenu.meta.icon"></Icon>
              <span>{{ submenu.meta.title }}</span>
            </MenuItem>
          </Submenu>
          <MenuItem class="menu-link" :name="menu.name" :key="menu.name" v-else>
            <Icon :type="menu.meta.icon" v-if="menu.meta.icon"></Icon>
            <span>{{ menu.meta.title }}</span>
          </MenuItem>
        </template>
      </Menu>
    </Sider>
    <Layout style="overflow-y: auto; height: 100vh; position: relative;">
      <Content class="app-content">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import routes from '../../router/routes'
import { cloneDeep } from 'lodash'

export default {
  name: 'Default',
  data() {
    return {
      routeMenus: this.genMenu(routes),
    }
  },

  methods: {
    genMenu(r) {
      return r.filter(route => route.meta)
    },

    menuClick(name) {
      this.$router.push({ name })
    },

    handleLogout() {},
  },
}
</script>

<style scoped>
.app-container .app-sider {
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}

.app-container .app-sider .profile .user {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  color: white;
  text-shadow: 1px 10px 10px rgba(red, green, blue, 0.1);
  text-align: center;
}

.app-container .app-sider .profile .user .avatar {
  width: 80px;
  height: 80px;
  margin-bottom: 8px;
  border-radius: 50%;
  border: 2px solid #e9eaec;
  box-shadow: 1px 10px 10px rgba(0, 0, 0, 0.1);
}
.app-container .app-sider .profile .user .name {
  margin-bottom: 8px;
}
.app-container .app-sider .profile .user .slogan {
  color: rgba(255, 255, 255, 0.65);
}
.app-container .app-sider .profile .action {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}
.app-container .app-sider .profile .action a {
  display: inline-block;
  width: 36px;
  height: 36px;
  margin: 0 8px;
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.app-container .app-sider .profile .action a:hover {
  background-color: #57a3f3;
}
.app-container .app-header {
  z-index: 999;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-color: #fff;
}
.app-container .app-content {
  margin: 24px;
}
</style>
