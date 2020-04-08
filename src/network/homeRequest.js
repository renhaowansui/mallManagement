import { request } from './request'

export function homeRequest(){
  return request({
    url: 'menus',
  })
}