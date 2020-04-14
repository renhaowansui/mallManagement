import { request } from './request'

export function getCategoryRequest(requestInfo){
  return request({
    url: 'categories',
    params: requestInfo
  })
}

export function addCategoryRequest(cat_pid, cat_name, cat_level){
  return request({
    url: 'categories',
    method: 'POST',
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  })
}

export function editCategoryRequest(cat_id, cat_name){
  return request({
    url: 'categories/' + cat_id,
    method: 'PUT',
    data: {
      cat_name
    }
  })
}

export function deleteCategoryRequest(cat_id){
  return request({
    url: 'categories/' + cat_id,
    method: 'DELETE'
  })
}