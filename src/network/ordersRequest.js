import { request } from './request'

export function getOrdersRequest(requestInfo){
  return request({
    url: 'orders',
    params: {
      query: requestInfo.query,
      pagenum: requestInfo.pagenum,
      pagesize: requestInfo.pagesize
    }
  })
}

export function logisticsInfoRequest(num){
  return request({
    url: '/kuaidi/' + '1106975712662',
  })
}