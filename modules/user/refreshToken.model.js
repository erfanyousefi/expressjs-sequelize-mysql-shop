const {DataTypes} = require("sequelize");
const sequelize = require("../../config/sequelize.config");

const RefreshToken = sequelize.define("refresh_token", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    token: {type: DataTypes.TEXT, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: true}
}, {
    modelName: "refresh_token",
    createdAt: "created_at",
    updatedAt: false,
});

module.exports = {
    RefreshToken,
};