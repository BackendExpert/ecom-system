const {
    RoleErrorResDTO,
    CreateRoleDTO,
    CreatePremissionDTO,
    GetPermissionForRole,
    DeleteRoleDTO,
    DeletePermissionDTO
} = require("../dtos/role.dto");
const RoleService = require("../services/role.service");

const RoleController = {
    createRole: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const {
                rolename
            } = req.body

            const roledto = CreateRoleDTO(token, rolename)

            const result = await RoleService.createRole(
                roledto.token,
                roledto.name,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(RoleErrorResDTO(err.message));
        }
    },

    createPermissions: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const {
                perName
            } = req.body

            const roleid = req.params.id

            const perdto = CreatePremissionDTO(
                token,
                roleid,
                perName
            )

            const result = await RoleService.createPermissions(
                perdto.token,
                perdto.roleid,
                perdto.perName,
                req
            )

            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(RoleErrorResDTO(err.message));
        }
    },

    getallroles: async (req, res) => {
        try {
            const result = await RoleService.getallroles()
            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(RoleErrorResDTO(err.message));
        }
    },

    getpermissions: async (req, res) => {
        try {

            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }
            const roleid = req.params.id

            const roleperdto = GetPermissionForRole(
                token,
                roleid
            )

            const result = await RoleService.getpermissions(
                roleperdto.token,
                roleperdto.roleid
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(RoleErrorResDTO(err.message));
        }
    },

    deleterole: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const roleid = req.params.id

            const deleteroledto = DeleteRoleDTO(token, roleid)

            const result = await RoleService.deleterole(
                deleteroledto.token,
                deleteroledto.roleid,
                req
            )
            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(RoleErrorResDTO(err.message));
        }
    },

    deletepermission: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const {
                perName
            } = req.body

            const roleid = req.params.id

            const delteperdto = DeletePermissionDTO(token, roleid, perName)

            const result = await RoleService.deletePermission(
                delteperdto.token,
                delteperdto.roleid,
                delteperdto.perName,
                req
            )

            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(RoleErrorResDTO(err.message));
        }
    }
};

module.exports = RoleController;