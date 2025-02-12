const {Router} = require("express");
const {createProductValidation} = require("./validation");
const {createProductHandler, getProductsHandler, getProductDetailByIdHandler, removeProductHandler} = require("./product.service");

const router = Router();
router.post("/", createProductValidation, createProductHandler);
router.get("/", getProductsHandler);
router.get("/:id", getProductDetailByIdHandler);
router.delete("/:id", removeProductHandler);

module.exports = {
    productRoutes: router
};