const {DataTypes} = require("sequelize");
const sequelize = require("../../config/sequelize.config");
const {ProductTypes} = require("../../common/constant/product.const");

const Product = sequelize.define("product", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    price: {type: DataTypes.DECIMAL, allowNull: true},
    discount: {type: DataTypes.INTEGER, allowNull: true},
    active_discount: {type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false},
    type: {type: DataTypes.ENUM(...Object.values(ProductTypes))},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    description: {type: DataTypes.TEXT},
}, {
    modelName: "product",
    createdAt: "created_at",
    updatedAt: "updated_at"
});
const ProductDetail = sequelize.define("product_detail", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    key: {type: DataTypes.STRING},
    value: {type: DataTypes.STRING},
    productId: {type: DataTypes.INTEGER},
}, {
    timestamps: false,
    modelName: "product_detail"
});
const ProductColor = sequelize.define("product_color", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    color_name: {type: DataTypes.STRING},
    color_code: {type: DataTypes.STRING},
    productId: {type: DataTypes.INTEGER},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    price: {type: DataTypes.DECIMAL, defaultValue: 0},
    discount: {type: DataTypes.INTEGER, allowNull: true},
    active_discount: {type: DataTypes.BOOLEAN, defaultValue: false},
}, {
    timestamps: false,
    modelName: "product_color"
});
const ProductSize = sequelize.define("product_size", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    size: {type: DataTypes.STRING},
    productId: {type: DataTypes.INTEGER},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    price: {type: DataTypes.DECIMAL, defaultValue: 0},
    discount: {type: DataTypes.INTEGER, allowNull: true},
    active_discount: {type: DataTypes.BOOLEAN, defaultValue: false},
}, {
    timestamps: false,
    modelName: "product_size"
});

module.exports = {
    Product,
    ProductDetail,
    ProductSize,
    ProductColor
};