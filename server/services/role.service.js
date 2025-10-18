const jwt = require("jsonwebtoken")

const Role = require("../models/role.model");
const User = require("../models/user.model")

const logUserAction = require("../utils/others/logUserAction")
const {
    CreateRoleResDTO,
    CreatePremissionResDTO,
    GetRoleResDTO,
    GetPermissionForResRole,
    DeleteRoleResDTO,
    DeletePermissionResDTO
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

    static async createPermissions(token, roleid, permissions, req) {
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

        const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];

        const getrole = await Role.findById(roleid);
        if (!getrole) throw new Error("Role not found");

        const existingPermissions = getrole.permissions.map(p => p.toString());
        const newPermissions = permissionsArray.filter(p => !existingPermissions.includes(p));

        if (newPermissions.length === 0) {
            return {
                success: false,
                error: "No new permissions were added."
            };
        }

        const permissionCreate = await Role.findByIdAndUpdate(
            roleid,
            { $addToSet: { permissions: { $each: newPermissions } } },
            { new: true, runValidators: true }
        );

        if (permissionCreate && req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(
                req,
                "new_permission_create",
                `${decoded.email} new Permission Created for ${getrole.name}`,
                metadata,
                user._id
            );
        }

        return CreatePremissionResDTO()

    }

    static async getallroles() {
        const getroles = await Role.find()
        return GetRoleResDTO(getroles)
    }

    static async getpermissions(token, roleid) {
        const getpermission = await Role.findById(roleid)
        return GetPermissionForResRole(getpermission)
    }

    static async deleterole(token, roleid, req) {
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

        const checkrole = await Role.findById(roleid).lean();
        if (!checkrole) {
            throw new Error(`Role not found with id: ${roleid}`);
        }

        const systemRoles = ["admin", "staff", "vendor", "buyer"];

        if (systemRoles.includes(checkrole.name)) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };

                await logUserAction(
                    req,
                    "delete_role_failed",
                    `${decoded.email} attempted to delete protected role: ${checkrole.name}`,
                    metadata,
                    user._id
                );
            }

            throw new Error("Cannot delete a default system role.");
        }

        const roledelete = await Role.findByIdAndDelete(roleid);

        if (roledelete) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "delete_role", `${decoded.email} delete role`, metadata, user._id);
            }

            return DeleteRoleResDTO()
        }
    }

    static async deletePermission(token, roleid, permission, req) {
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

        const updatedRole = await Role.findByIdAndUpdate(
            roleid,
            { $pull: { permissions: permission } },
            { new: true }
        );

        if (updatedRole) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "delete_permission", `${decoded.email} successfully deleted permission ${permission}`, metadata, user._id);
            }

            return DeletePermissionResDTO()
        }

    }
}

module.exports = RoleService