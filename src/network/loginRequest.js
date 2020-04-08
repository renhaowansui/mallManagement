import { request } from './request'

export function loginRequest(user, pwd){
  return request({
    url: 'login',
    method: 'post',
    params: {
      username: user,
      password: pwd
    }
  })
}