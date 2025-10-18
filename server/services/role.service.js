const jwt = require("jsonwebtoken")

const logUserAction = require("../utils/others/logUserAction")

const Role = require("../models/role.model");
const User = require("../models/user.model")

const {
    CreateRoleResDTO
} = require("../dtos/role.dto");


class RoleService {
    static async createRole(token, rolename, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }
        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const checkrole = await Role.findOne({ name: rolename })

        if (checkrole) {
            throw new Error("Role Already Exist")
        }

        const newRole = new Role({
            name: rolename,
        })

        const resultCreateRole = await newRole.save()

        if (resultCreateRole) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "role_created", `${decoded.email} Create Role ${rolename}`, metadata, user._id);
            }

            return CreateRoleResDTO()
        }
    }

    static async createPermission(token, roleid, perName) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        
    }
}

module.exports = RoleService