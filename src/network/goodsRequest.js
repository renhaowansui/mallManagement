import { request } from './request'

export function getGoodsRequest(requestInfo){
  return request({
    url: 'goods',
    params: requestInfo
  })
}

export function addGoodRequest(goodInfo){
  return request({
    url: 'goods',
    method: 'POST',
    data: {
      goods_name: goodInfo.goods_name,
      goods_price: goodInfo.goods_price,
      goods_number: goodInfo.goods_number,
      goods_weight: goodInfo.goods_weight,
      goods_cat: goodInfo.goods_cat.join(','),
      attrs: goodInfo.attrs,
      pics:[
        {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}        
      ],
      goods_introduce: goodInfo.goods_introduce
    }
  })
}

export function deleteGoodRequest(goodId){
  return request({
    url: 'goods/' + goodId,
    method: 'DELETE'
  })
}