/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-22 20:49:56
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-30 16:17:23
 * @FilePath: /MewBoss-Frontend/src/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getToken } from '@/utils/token'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/JobView',
      meta: {
        closeNav: false,
        needLogin: false
      }
    },
    {
      path: '/UserProfile',
      name: 'UserProfile',
      component: () => import('../views/UserProfile.vue'),
      meta: {
        needLogin: false
      }
    },
    {
      path: '/CompanyProfile',
      name: 'CompanyProfile',
      component: () => import('../views/CompanyProfile.vue'),
      meta: {
        needLogin: false
      }
    },
    {
      path: '/HomeView',
      name: 'HomeView',
      component: () => import('../views/HomeView.vue'),
      meta: {
        needLogin: false
      }
    },
    {
      path: '/ToShowView',
      name: 'ToShowView',
      component: () => import('../views/EnterShowCardView.vue'),
      meta: {
        needLogin: false
      }
    },
    {
      path: '/JobDetailsView',
      name: 'JobDetailsView',
      component: () => import('../views/JobDetailsView.vue'),
      meta: {
        needLogin: false
      }
    },
    {
      path: '/PeopleFrame',
      name: 'PeopleFrame',
      component: () => import('../components/forFollow/PeopleItem.vue'),
      meta: {
        needLogin: false
      }
    },
    {
      path: '/RelationshipView',
      name: 'RelationshipView',
      component: () => import('../views/RelationshipView.vue'),
      meta: {
        needLogin: false
      }
    },
    {
      path: '/JobView',
      name: 'JobView',
      component: () => import('../views/JobView.vue'),
      meta: {
        needLogin: false
      }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: {
        needLogin: true
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: {
        needLogin: true
      }
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        closeNav: true,
        needLogin: false
      }
    },

    {
      path: '/FollowedFrame',
      name: 'FollowedFrame',
      component: () => import('../components/forFollow/FollowedItem.vue'),
      meta: {
        needLogin: true
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: {
        needLogin: false
      }
    }
  ]
})

router.beforeEach(function (to, from, next) {
  let login_in = getToken('csrftoken') // 是否已登录
  let require = to.matched.some(function (item) {
    // 是否需要登录
    return item.meta.needLogin
  })
  window.$loadingBar.start()
  if (!login_in && require) {
    // 当未登录，且跳转的页面需要登录后才能操作时，进行路由拦截
    console.log('路由跳转：未登录警告触发')
    window.$message.error('请登录后再访问')
    setTimeout(() => {
      next({
        // 跳转登录页
        path: '/login',
        params: { redirect: to } // 将 要跳转（即被拦截） 的路由对象，作为参数，传递到登录页面
      })
    }, 1000)
    window.$loadingBar.error()
  } else {
    if (login_in) to.query.id = to.query.id ? to.query.id : getToken('id')
    // 已登录就正常跳转，不做任何拦截
    next() // 正常跳转到下一页
  }
})
router.afterEach(function (to) {
  document.title = to.name //跳转后设置页面的title
  window.$loadingBar.finish()
})

export default router
