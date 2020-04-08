import { request } from './request'

export function getRightsRequest(type){
  return request({
    url: 'rights/' + type
  })
}