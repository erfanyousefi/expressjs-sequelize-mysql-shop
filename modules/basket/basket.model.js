const {DataTypes} = require("sequelize");
const sequelize = require("./../../config/sequelize.config");
const Basket = sequelize.define("basket", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    userId: {type: DataTypes.INTEGER},
    productId: {type: DataTypes.INTEGER, allowNull: true},
    sizeId: {type: DataTypes.INTEGER, allowNull: true},
    colorId: {type: DataTypes.INTEGER, allowNull: true},
    discountId: {type: DataTypes.INTEGER, allowNull: true},
    count: {type: DataTypes.INTEGER},
}, {timestamps: false, modelName: "basket"});

module.exports = {
    Basket
};