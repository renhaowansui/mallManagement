import axios from 'axios'

export function request(config){
  const instance = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
    timeout: 10000
  })

  instance.interceptors.request.use(config => {
    // 拦截处理请求代码
    // 添加请求头token
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })
  instance.interceptors.response.use(config => {
    // 拦截处理响应代码

    return config.data
  })
  return instance(config)
}
