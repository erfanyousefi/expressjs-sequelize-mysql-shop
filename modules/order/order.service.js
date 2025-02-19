const createHttpError = require("http-errors");
const {OrderStatus} = require("../../common/constant/order.const");
const {Order, OrderItems} = require("./order.model");
const {ProductColor, ProductSize, Product} = require("../product/product.model");

async function getMyOrdersHandler (req, res, next) {
    try {
        const {id: userId} = req.user;
        const {status} = req.query;
        if (!status || !Object.values(OrderStatus).includes(status)) {
            throw createHttpError(400, "send correct status");
        }
        const orders = await Order.findAll({
            where: {status, userId},
        });
        return res.json({
            orders
        });
    } catch (error) {
        next(error);
    }
}
async function getOneOrderByIdHandler (req, res, next) {
    try {
        const {id: userId} = req.user;
        const {id} = req.params;
        const order = await Order.findOne({
            where: {
                id,
                userId
            },
            include: [
                {
                    model: OrderItems, as: "items", include: [
                        {model: Product, as: "product"},
                        {model: ProductColor, as: "color"},
                        {model: ProductSize, as: "size"},
                    ]
                }
            ]
        });
        if (!order) throw createHttpError(404, "not found order");
        return res.json({
            order
        });
    } catch (error) {
        next(error);
    }
}
async function setPackedStatusToOrder (req, res, next) {
    const {id} = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "notfound order");
    if (order.status !== OrderStatus.InProcess) throw createHttpError(400, "order status should be in-process");
    order.status = OrderStatus.Packed;
    await order.save();
    return res.json({
        message: "set order to packed line"
    });
}
async function setInTransitStatusToOrder (req, res, next) {
    const {id} = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "notfound order");
    if (order.status !== OrderStatus.Packed) throw createHttpError(400, "order status should be packed");
    order.status = OrderStatus.InTransit;
    await order.save();
    return res.json({
        message: "set order to in-transit line"
    });
}
async function setCanceledStatusToOrder (req, res, next) {
    const {id} = req.params;
    const {reason} = req.body;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "notfound order");
    if ([OrderStatus.Pending, OrderStatus.Delivery, OrderStatus.Canceled].includes(order.status))
        throw createHttpError(400, "select correct order to cancel");
    order.status = OrderStatus.Canceled;
    order.reason = reason;
    await order.save();
    return res.json({
        message: "canceled order successfully"
    });
}
async function setDeliveryStatusToOrder (req, res, next) {
    const {id} = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "notfound order");
    if (order.status !== OrderStatus.InTransit) throw createHttpError(400, "order status should be in-transit");
    order.status = OrderStatus.Delivery;
    await order.save();
    return res.json({
        message: "order delivery to customer successfully"
    });
}
module.exports = {
    getMyOrdersHandler,
    getOneOrderByIdHandler,
    setPackedStatusToOrder,
    setInTransitStatusToOrder,
    setCanceledStatusToOrder,
    setDeliveryStatusToOrder
};
