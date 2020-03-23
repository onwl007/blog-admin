export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '主页', icon: 'md-home', menu: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { title: '关于', icon: 'md-stats', menu: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '仪表盘', icon: 'md-stats', menu: true },
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('../views/Article.vue'),
    meta: { title: '文章管理', icon: 'md-bookmarks' },
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../views/Category.vue'),
    meta: { title: '分类管理', icon: 'md-filing', menu: true },
  },
  {
    path: '/Tag',
    name: 'Tag',
    component: () => import('../views/Tag.vue'),
    meta: { title: '标签管理', icon: 'md-bookmark', menu: true },
  },
  {
    path: '/comment',
    name: 'Comment',
    component: () => import('../views/Comment.vue'),
    meta: { title: '评论管理', icon: 'md-text', menu: true },
  },
  {
    path: '/moment',
    name: 'Moment',
    component: () => import('../views/Moment.vue'),
    meta: { title: '说说管理', icon: 'md-timer', menu: true },
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue'),
    meta: { title: '配置管理', icon: 'md-settings', menu: true },
  },
]
