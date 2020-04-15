import axios from 'axios'
import nProgress from 'nprogress'


export function request(config){
  const instance = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
    timeout: 10000
  })

  instance.interceptors.request.use(config => {
    nProgress.start()
    // 拦截处理请求代码
    // 添加请求头token
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })
  instance.interceptors.response.use(config => {
    // 拦截处理响应代码
    nProgress.done();
    return config.data
  })
  return instance(config)
}
