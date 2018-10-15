import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    // name: '主页',
    hidden: true,
    // meta: { title: '主页' },
    children: [{
      path: 'dashboard',
      name: '主页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'admins' }
    }]
  },

  {
    path: '/foodNews',
    component: Layout,
    redirect: '/foodNews/list',
    name: '资讯',
    meta: { title: '资讯', icon: 'content' },
    children: [
      {
        path: '/foodNews/list',
        name: '美食资讯',
        component: () => import('@/views/foodNews/index'),
        meta: { title: '美食资讯', icon: 'newss' }
      },
      {
        path: '/foodNews/create',
        name: '添加美食资讯',
        hidden: true,
        component: () => import('@/views/foodNews/create'),
        meta: { title: '添加美食资讯', icon: 'list' }
      },
      {
        path: '/foodNews/create/:id',
        name: '编辑美食资讯',
        hidden: true,
        component: () => import('@/views/foodNews/create'),
        meta: { title: '编辑美食资讯', icon: 'list' }
      }
    ]
  },

  {
    path: '/category',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '分类管理',
        component: () => import('@/views/category/index'),
        meta: { title: '分类管理', icon: 'admins' }
      }
    ]
  },

  {
    path: '/admin',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '用户管理',
        component: () => import('@/views/admin/index'),
        meta: { title: '账户管理', icon: 'admins' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
