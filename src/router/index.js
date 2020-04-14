import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("views/login/Login")
const Home = () => import("views/home/Home")
const Welcome = () => import("views/home/childComponents/welcome")
const Users = () => import("views/home/users/users")
const Roles = () => import("views/home/rights/Roles")
const Rights = () => import("views/home/rights/Rights")
const Category = () => import("views/home/goods/Category")
const Params = () => import("views/home/goods/Params")
const Goods = () => import("views/home/goods/Goods")
const AddGood = () => import("views/home/goods/AddGood")

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
        redirect: '/welcome'
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/categories',
        component: Category
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goods/add',
        component: AddGood
      }
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
