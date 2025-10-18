const {
    RoleErrorResDTO,
    CreateRoleDTO
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

            const roledto = CreateRoleDTO(rolename, token)

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
    }
};

module.exports = RoleController;