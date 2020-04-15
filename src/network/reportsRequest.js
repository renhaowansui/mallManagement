import { request } from './request'

export function getReportsRequest(){
  return request({
    url: 'reports/type/1'
  })
}