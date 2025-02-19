const createHttpError = require("http-errors");
const {Role, Permission} = require("./rbac.model");

async function createRoleHandler (req, res, next) {
    try {
        const {title, description} = req.body; //Admin, Accountant, Support, Support-2
        const existRole = await Role.findOne({where: {title}});
        if (existRole) throw createHttpError(409, "already exist role title");
        await Role.create({
            title,
            description
        });
        return res.json({
            message: "role created successfully"
        });
    } catch (error) {
        next(error);
    }
}
async function createPermissionHandler (req, res, next) {
    try {
        const {title, description} = req.body; //Admin, Accountant, Support, Support-2
        const existPermission = await Permission.findOne({where: {title}});
        if (existPermission) throw createHttpError(409, "already exist permission title");
        await Permission.create({
            title,
            description
        });
        return res.json({
            message: "permission created successfully"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createRoleHandler,
    createPermissionHandler
};