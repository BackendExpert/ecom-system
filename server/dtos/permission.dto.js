exports.CreatePermissionDTO = (
    name,
    desc,
    token
) => ({
    name,
    desc,
    token
})

exports.CreatePermissionResDTO = (message = "Permission Created Successfully") => ({ success: true, message})


exports.GrantPermissionToUserDTO = (token, userid, permissionid) => ({ token, userid, permissionid })

exports.GrantPermissionToUserResDTO = (message="Permission Grant to User Successfully") => ({ success: true, message })