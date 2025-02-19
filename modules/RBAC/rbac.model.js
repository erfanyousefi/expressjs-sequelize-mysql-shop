const {DataTypes} = require("sequelize");
const sequelize = require("../../config/sequelize.config");

const Role = sequelize.define("role", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
}, {timestamps: false, modelName: "role"});
const Permission = sequelize.define("permission", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
}, {timestamps: false, modelName: "permission"});
const RolePermission = sequelize.define("role_permission", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    roleId: {type: DataTypes.INTEGER, allowNull: false},
    permissionId: {type: DataTypes.INTEGER, allowNull: false},
}, {timestamps: false, modelName: "role_permission"});

module.exports = {
    Role,
    Permission,
    RolePermission
};