import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("views/login/Login")
const Home = () => import("views/home/Home")
const Welcome = () => import("views/home/childComponents/welcome")
const Users = () => import("views/home/users/users")
const Roles = () => import("views/home/rights/Roles")
const Rights = () => import("views/home/rights/Rights")

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/home',
        redirect: '/home/welcome'
      },
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        component: Users
      },
      {
        path: 'roles',
        component: Roles
      },
      {
        path: 'rights',
        component: Rights
      },
      
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === "/login") return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
