const express = require('express');
const auth = require("../middlewares/authMiddleware")
const checkPermission = require("../middlewares/checkPermission");
const RoleController = require('../controllers/role.controller');

const router = express.Router();

router.post('/create-role', auth, checkPermission(['role:create']), RoleController.createRole)

router.post('/create-permission/:id', auth, checkPermission(['permission:create']), RoleController.createPermissions)

router.get('/get-roles', auth, checkPermission(['role:readall']), RoleController.getallroles)

router.get('/get-permission/:id', auth, checkPermission(['permission:manage']), RoleController.getpermissions)

router.delete('/delete-role/:id', auth, checkPermission(['role:delete']), RoleController.deleterole)

router.delete('/delete-permission/:id', auth, checkPermission(['permission:delete']), RoleController.deletepermission)

module.exports = router;