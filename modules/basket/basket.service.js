const createHttpError = require("http-errors");
const {Product, ProductColor, ProductSize} = require("./../product/product.model");
const {ProductTypes} = require("../../common/constant/product.const");
const {Basket} = require("./basket.model");
async function addToBasketHandler (req, res, next) {
    try {
        const {id: userId = undefined} = req?.user ?? {};
        const {productId, sizeId, colorId} = req.body;
        const product = await Product.findByPk(productId);
        if (!product) throw createHttpError(404, "not found product");
        const basketItem = {
            productId: product.id,
            userId
        };
        let productCount = undefined;
        let colorCount = undefined;
        let sizeCount = undefined;
        if (product.type === ProductTypes.Coloring) {
            if (!colorId) throw createHttpError(400, "send product color detail");
            const productColor = await ProductColor.findByPk(colorId);
            if (!productColor) throw createHttpError(404, "not found color");
            basketItem['colorId'] = colorId;
            colorCount = productColor?.count ?? 0;
            if (colorCount === 0) throw createHttpError(400, "product count not enough");

        } else if (product.type === ProductTypes.Sizing) {
            if (!sizeId) throw createHttpError(400, "send product color count detail");
            const productSize = await ProductSize.findByPk(sizeId);
            if (!productSize) throw createHttpError(404, "not found size");
            basketItem['sizeId'] = sizeId;
            sizeCount = productSize?.count ?? 0;
            if (sizeCount === 0) throw createHttpError(400, "product size count not enough");
        } else {
            productCount = product?.count ?? 0;
            if (productCount === 0) throw createHttpError(400, "product count not enough");
        }
        const basket = await Basket.findOne({where: basketItem});
        if (basket) {
            if (sizeCount && sizeCount > basket?.count) {
                basket.count += 1;
            } else if (colorCount && colorCount > basket?.count) {
                basket.count += 1;
            } else if (productCount && productCount > basket?.count) {
                basket.count += 1;
            } else {
                throw createHttpError(400, "product count not enough");
            }
            await basket.save();
        } else {
            await Basket.create({...basketItem, count: 1});
        }
        return res.json({
            message: "added to basket successfully"
        });
    } catch (error) {
        next(error);
    }
}
async function getUserBasketHandler (req, res, next) {
    try {
        const {id: userId} = req.user;
        const result = await getUserBasketById(userId);
        return res.json(result);
    } catch (error) {
        next(error);
    }
}
async function getUserBasketById (userId) {
    const basket = await Basket.findAll({
        where: {userId},
        include: [
            {model: Product, as: "product"},
            {model: ProductColor, as: "color"},
            {model: ProductSize, as: "size"},
        ]
    });
    if (basket?.length === 0) throw createHttpError(400, "your basket is empty");
    let totalAmount = 0;
    let totalDiscount = 0;
    let finalAmount = 0;
    let finalBasket = [];
    for (const item of basket) {
        const {product, color, size, count} = item;
        const productIndex = finalBasket.findIndex((item) => item.id === product.id);
        let productData = finalBasket.find((item) => item.id === product.id);
        if (!productData) {
            productData = {
                id: product.id,
                title: product.title,
                price: product.price,
                type: product.type,
                count,
                sizes: [],
                colors: [],
            };
        } else {
            productData.count += count;
        }
        if (product?.type === ProductTypes.Coloring && color) {
            let price = color?.price * count;
            totalAmount += price;
            let discountAmount = 0;
            let finalPrice = price;
            if (color?.active_discount && color?.discount > 0) {
                discountAmount = price * (color?.discount / 100);
                totalDiscount += discountAmount;
            }
            finalPrice = (price - discountAmount);
            finalAmount += finalPrice;
            productData['colors'].push({
                id: color.id,
                colo_name: color?.color_name,
                color_code: color?.color_code,
                price,
                discountAmount,
                finalPrice,
                count
            });
        } else if (product?.type === ProductTypes.Sizing && size) {
            let price = size?.price * count;
            totalAmount += price;
            let discountAmount = 0;
            let finalPrice = price;
            if (size?.active_discount && size?.discount > 0) {
                discountAmount = price * (size?.discount / 100);
                totalDiscount += discountAmount;
            }
            finalPrice = (price - discountAmount);
            finalAmount += finalPrice;
            productData['sizes'].push({
                id: size.id,
                size: size?.size,
                price,
                discountAmount,
                finalPrice,
                count
            });
        } else if (product?.type === ProductTypes.Single && product) {
            let price = product?.price * count;
            totalAmount += price;
            let discountAmount = 0;
            let finalPrice = price;
            if (product?.active_discount && product?.discount > 0) {
                discountAmount = price * (product?.discount / 100);
                totalDiscount += discountAmount;
            }
            finalPrice = (price - discountAmount);
            finalAmount += finalPrice;
            productData['finalPrice'] = finalPrice;
            productData['discountAmount'] = discountAmount;
        }
        if (productIndex > -1) finalBasket[productIndex] = productData;
        else finalBasket.push(productData);
    }
    return {
        totalAmount,
        totalDiscount,
        finalAmount,
        basket: finalBasket
    };
}
module.exports = {
    addToBasketHandler,
    getUserBasketHandler,
    getUserBasketById
};