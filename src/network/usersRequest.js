import { request } from './request'

export function usersRequest(requestInfo){
  return request({
    url: 'users',
    params: {
      query: requestInfo.query,
      pagenum: requestInfo.pagenum,
      pagesize: requestInfo.pagesize
    }
  })
}

export function userStateChangedRequest(userId, state){
  return request({
    url: 'users/' + userId + '/state/' + state,
    method: 'PUT'
  })
}

export function addUserRequest(userInfo){
  return request({
    url: 'users',
    method: 'POST',
    data: userInfo
  })
}

export function editUserRequest(userInfo){
  return request({
    url: 'users/' + userInfo.id,
    method: 'PUT',
    data: userInfo
  })
}

export function deleteUserRequest(userId){
  return request({
    url: 'users/' + userId,
    method: 'delete'
  })
}

export function setUserRoleRequest(userId, roleId){
  return request({
    url: 'users/' + userId + '/role',
    method: 'PUT',
    data: {
      rid: roleId
    }
  })
}