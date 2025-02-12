const {Basket} = require("../modules/basket/basket.model");
const {Discount} = require("../modules/discount/discount.model");
const {Order, OrderItems} = require("../modules/order/order.model");
const {Payment} = require("../modules/payment/payment.model");
const {Product, ProductDetail, ProductColor, ProductSize} = require("../modules/product/product.model");
const {RefreshToken} = require("../modules/user/refreshToken.model");
const {User, Otp} = require("../modules/user/user.model");
const sequelize = require("./sequelize.config");

async function initDatabase () {
    Product.hasMany(ProductDetail, {foreignKey: "productId", sourceKey: "id", as: "details"});
    ProductDetail.belongsTo(Product, {foreignKey: "productId", targetKey: "id"});

    Product.hasMany(ProductColor, {foreignKey: "productId", sourceKey: "id", as: "colors"});
    ProductColor.belongsTo(Product, {foreignKey: "productId", targetKey: "id"});

    Product.hasMany(ProductSize, {foreignKey: "productId", sourceKey: "id", as: "sizes"});
    ProductSize.belongsTo(Product, {foreignKey: "productId", targetKey: "id"});
    User.hasOne(Otp, {foreignKey: "userId", as: "otp", sourceKey: "id"});
    Otp.hasOne(User, {foreignKey: "otpId", as: "otp", sourceKey: "id"});
    Otp.belongsTo(User, {foreignKey: "userId", targetKey: "id"});

    Product.hasMany(Basket, {foreignKey: "productId", sourceKey: "id", as: "basket"});
    ProductColor.hasMany(Basket, {foreignKey: "colorId", sourceKey: "id", as: "basket"});
    ProductSize.hasMany(Basket, {foreignKey: "sizeId", sourceKey: "id", as: "basket"});
    User.hasMany(Basket, {foreignKey: "userId", sourceKey: "id", as: "basket"});
    Discount.hasMany(Basket, {foreignKey: "discountId", sourceKey: "id", as: "basket"});

    Basket.belongsTo(Product, {foreignKey: "productId", targetKey: "id", as: "product"});
    Basket.belongsTo(User, {foreignKey: "userId", targetKey: "id", as: "user"});
    Basket.belongsTo(ProductColor, {foreignKey: "colorId", targetKey: "id", as: "color"});
    Basket.belongsTo(ProductSize, {foreignKey: "sizeId", targetKey: "id", as: "size"});
    Basket.belongsTo(Discount, {foreignKey: "discountId", targetKey: "id", as: "discount"});

    Order.hasMany(OrderItems, {foreignKey: "orderId", sourceKey: "id", as: "items"});
    User.hasMany(Order, {foreignKey: "userId", sourceKey: "id", as: "orders"});
    OrderItems.belongsTo(Order, {foreignKey: "orderId", targetKey: "id"});

    Order.hasOne(Payment, {foreignKey: "orderId", as: "payment", sourceKey: "id"});
    Payment.hasOne(Order, {foreignKey: "paymentId", as: "order", sourceKey: "id"});

    // RefreshToken.sync();
    // Discount.sync({});
    // Basket.sync({});
    // await sequelize.sync({alter: true});
}

module.exports = initDatabase;