const {Router} = require("express");
const AuthGuard = require("../auth/auth.guard");
const {createRoleHandler, createPermissionHandler, assignPermissionToRoleHandler} = require("./rbac.service");
const {assignPermissionToRoleValidation} = require("./validation");

const router = Router();
router.post("/role", AuthGuard, createRoleHandler);
router.post("/permission", AuthGuard, createPermissionHandler);
router.post("/add-permission-to-role", AuthGuard, assignPermissionToRoleValidation, assignPermissionToRoleHandler);
module.exports = {
    rbacRoutes: router
};