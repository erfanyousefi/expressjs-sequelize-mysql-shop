const {DataTypes} = require("sequelize");
const sequelize = require("../../config/sequelize.config");
const {OrderStatus} = require("../../common/constant/order.const");

const Order = sequelize.define("order", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    paymentId: {type: DataTypes.INTEGER, allowNull: true},
    status: {type: DataTypes.ENUM(...Object.values(OrderStatus)), defaultValue: OrderStatus.Pending},
    address: {type: DataTypes.TEXT},
    userId: {type: DataTypes.INTEGER},
    total_amount: {type: DataTypes.DECIMAL},
    final_amount: {type: DataTypes.DECIMAL},
    discount_amount: {type: DataTypes.DECIMAL},
    reason: {type: DataTypes.STRING, allowNull: true},
}, {
    modelName: "order",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

const OrderItems = sequelize.define("order_item", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    orderId: {type: DataTypes.INTEGER},
    productId: {type: DataTypes.INTEGER},
    sizeId: {type: DataTypes.INTEGER, allowNull: true},
    colorId: {type: DataTypes.INTEGER, allowNull: true},
    count: {type: DataTypes.INTEGER},

}, {timestamps: false, modelName: "order_item"});

module.exports = {
    Order,
    OrderItems
};