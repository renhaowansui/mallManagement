import { request } from './request'

export function getParamsRequest(cat_id, sel){
  return request({
    url: 'categories/' + cat_id + '/attributes',
    params: {
      sel
    }
  })
}

export function addParamsRequest(paramsInfo){
  return request({
    url: 'categories/' + paramsInfo.cat_id + '/attributes',
    method: 'POST',
    data: {
      attr_name: paramsInfo.attr_name,
      attr_sel: paramsInfo.attr_sel,
      attr_vals: paramsInfo.attr_vals
    }
  })
}

export function editParamsRequest(paramsInfo){
  return request({
    url: 'categories/' + paramsInfo.cat_id + '/attributes/' + paramsInfo.attr_id,
    method: 'PUT',
    data: {
      attr_name: paramsInfo.attr_name,
      attr_sel: paramsInfo.attr_sel,
      attr_vals: paramsInfo.attr_vals.join(' ')
    }
  })
}

export function deleteParamsRequest(cat_id, attr_id){
  return request({
    url: 'categories/' + cat_id + '/attributes/ ' + attr_id,
    method: 'delete'
  })
}