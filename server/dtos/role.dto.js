exports.CreateRoleDTO = (token, name) => ({ token, name })
exports.CreateRoleResDTO = (message = "Role Created Successfully") => ({ success: true, message })

exports.CreatePremissionDTO = (token, roleid, perName) => ({ token, roleid, perName })
exports.CreatePremissionResDTO = (message = "Permission Added to Role Successfully") => ({ success: true, message})

exports.GetRoleResDTO = (result, message="All Roles Fetched Successfully") => ({ success: true, result, message })

exports.GetPermissionForRole = (token, roleid) => ({ token, roleid })
exports.GetPermissionForResRole = (result, message="All Permissions For Role Fetched Successfully") => ({ success: true, result, message})

exports.DeleteRoleDTO = (token, roleid) => ({ token, roleid })
exports.DeleteRoleResDTO = (message="Role Deleted Successfully") => ({ success: true, message })

exports.DeletePermissionDTO = (token, roleid, perName ) => ({ token, roleid, perName })
exports.DeletePermissionResDTO = (message="Permission Deleted Successfully") => ({ success: true, message })

exports.RoleErrorResDTO = (message="Something went wrong") => ({ success: false, message})