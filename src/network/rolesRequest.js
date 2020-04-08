import { request } from './request';

export function getRolesRequest(){
  return request({
    url: 'roles'
  })
}

export function addRoleRequest(roleInfo){
  return request({
    url: 'roles',
    method: 'POST',
    data: roleInfo
  })
}

export function editRoleRequest(roleInfo){
  return request({
    url: 'roles/' + roleInfo.id,
    method: 'PUT',
    data: {
      roleName: roleInfo.roleName,
      roleDesc: roleInfo.roleDesc
    }
  })
}

export function deleteRoleRequest(roleId){
  return request({
    url: 'roles/' + roleId,
    method: 'DELETE'
  })
}

export function deleteRightRequest(roleId, rightId){
  return request({
    url: 'roles/' + roleId + '/rights/' + rightId,
    method: 'DELETE'
  })
}

export function getRightsRequest(type){
  return request({
    url: 'rights/' + type
  })
}

export function setRightsRequest(roleId, rights){
  return request({
    url: 'roles/' + roleId + '/rights',
    method: 'POST',
    data: {
      rids: rights
    }
  })
}