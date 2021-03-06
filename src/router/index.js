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
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/changePs', component: () => import('@/views/password/Changeps'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/admin/index/listMenu',
    name: 'admin',
    meta: { title: '桌面' },
    children: [
      {
        path: '/admin/index/listMenu',
        name: '统计',
        meta: { title: '统计', noKeepAlive: true },
        component: () => import('@/views/Menu')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/product/productList',
    name: 'spgl',
    meta: { title: '商品管理' },
    children: [
      {
        path: '/admin/product/productList',
        name: '商品列表',
        meta: { title: '商品列表', noKeepAlive: true },
        component: () => import('@/views/product/ProductList')
      },
      {
        path: '/admin/product/productList/addProduct',
        name: '添加商品',
        meta: { title: '添加商品', noKeepAlive: true },
        component: () => import('@/views/product/AddProduct')
      },
      {
        path: '/admin/product/productList/setAgentProductCommissionSetting',
        name: '设置商品佣金规则',
        meta: { title: '设置商品佣金规则', noKeepAlive: true },
        component: () => import('@/views/product/setAgentProductCommissionSetting')
      },
      {
        path: '/admin/product/classList',
        name: '商品分类列表',
        meta: { title: '商品分类列表', noKeepAlive: true },
        component: () => import('@/views/product/ClassList')
      },
      {
        path: '/admin/product/productActivity',
        name: '商品活动列表',
        meta: { title: '商品活动列表', noKeepAlive: true },
        component: () => import('@/views/product/ProductActive')
      },
      {
        path: '/admin/product/swipe',
        name: '轮播列表',
        meta: { title: '轮播列表', noKeepAlive: true },
        component: () => import('@/views/product/Swipe')
      },
      {
        path: '/admin/product/productActivity/ActiveDetail',
        name: '活动详情',
        meta: { title: '活动详情', noKeepAlive: true },
        component: () => import('@/views/product/ActiveDetail')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/index/account',
    name: 'zh',
    meta: { title: '账户' },
    children: [
      {
        path: '/admin/index/account',
        name: '管理员列表',
        meta: { title: '管理员列表', noKeepAlive: true },
        component: () => import('@/views/account/Account')
      },
      {
        path: '/admin/index/listGroup',
        name: '后台用户组列表',
        meta: { title: '后台用户组列表', noKeepAlive: true },
        component: () => import('@/views/account/ListGroup')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/user/userList',
    name: 'hygl',
    meta: { title: '会员管理' },
    children: [
      {
        path: '/admin/user/userList',
        name: '会员列表',
        meta: { title: '会员列表', noKeepAlive: true },
        component: () => import('@/views/user/UserList')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/order/orderList',
    name: 'ddgl',
    meta: { title: '订单管理' },
    children: [
      {
        path: '/admin/order/orderList',
        name: '已付款订单列表',
        meta: { title: '已付款订单列表', noKeepAlive: true },
        component: () => import('@/views/order/OrderList')
      },
      {
        path: '/admin/order/OriginalOrderList',
        name: '原始订单列表',
        meta: { title: '原始订单列表', noKeepAlive: true },
        component: () => import('@/views/order/OriginalOrderList')
      },
      {
        path: '/admin/order/orderDetail',
        name: '已付款订单详情',
        meta: { title: '已付款订单详情', noKeepAlive: true },
        component: () => import('@/views/order/OrderDetail')
      },
      {
        path: '/admin/order/originalOrderDetail',
        name: '原始订单详情',
        meta: { title: '原始订单详情', noKeepAlive: true },
        component: () => import('@/views/order/OriginalOrderDetail')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/commission/listCommissionSetting',
    name: 'yj',
    meta: { title: '设置' },
    children: [
      {
        path: '/admin/commission/listCommission',
        name: '佣金综合设置',
        meta: { title: '佣金综合设置', noKeepAlive: true },
        component: () => import('@/views/commission/CommissionList')
      },
      {
        path: '/admin/commission/listCommissionSetting',
        name: '佣金提现设置',
        meta: { title: '佣金提现设置', noKeepAlive: true },
        component: () => import('@/views/commission/CommissionListSetting')
      }

      // userLog
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/ent/entList',
    name: 'dlgl',
    meta: { title: '代理管理' },
    children: [
      {
        path: '/admin/ent/entList',
        name: '代理商列表',
        meta: { title: '代理商列表', noKeepAlive: true },
        component: () => import('@/views/ent/MerchantList')
      },
      {
        path: '/admin/ent/entUserList',
        name: '代理列表',
        meta: { title: '代理列表', noKeepAlive: true },
        component: () => import('@/views/ent/EntUserList')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/withdraw/withdrawList',
    name: 'tx',
    meta: { title: '提现' },
    children: [
      {
        path: '/admin/withdraw/withdrawList',
        name: '提现申请列表',
        meta: { title: '提现申请列表', noKeepAlive: true },
        component: () => import('@/views/withdraw/WithdrawList')
      },
      {
        path: '/admin/withdraw/rechargeList',
        name: '充值列表',
        meta: { title: '充值列表', noKeepAlive: true },
        component: () => import('@/views/withdraw/rechargeList')
      },
      {
        path: '/admin/withdraw/userLog',
        name: '佣金列表',
        meta: { title: '佣金列表', noKeepAlive: true },
        component: () => import('@/views/withdraw/UserLog')
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
