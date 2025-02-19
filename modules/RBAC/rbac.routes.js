const {Router} = require("express");
const AuthGuard = require("../auth/auth.guard");
const {createRoleHandler, createPermissionHandler} = require("./rbac.service");

const router = Router();
router.post("/role", AuthGuard, createRoleHandler);
router.post("/permission", AuthGuard, createPermissionHandler);
module.exports = {
    rbacRoutes: router
};