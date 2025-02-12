const {OrderStatus} = require("../../common/constant/order.const");
const {getUserBasketById} = require("../basket/basket.service");
const {Order, OrderItems} = require("../order/order.model");
const {zarinpalRequest} = require("../zarinpal/zarinpal.service");
const {Payment} = require("./payment.model");

async function paymentBasketHandler (req, res, next) {
    try {
        const {id: userId} = req.user;
        const {basket, totalAmount, finalAmount, totalDiscount} = await getUserBasketById(userId);
        const payment = await Payment.create({
            userId,
            amount: finalAmount,
            status: false,
        });
        const order = await Order.create({
            userId,
            paymentId: payment.id,
            total_amount: totalAmount,
            final_amount: finalAmount,
            discount_amount: totalDiscount,
            status: OrderStatus.Pending,
            address: "Kurdistan - sanandaj - Azadi street, 123",
        });
        payment.orderId = order.id;
        await payment.save();
        let orderList = [];
        for (const item of basket) {
            let items = [];
            if (item?.sizes?.length > 0) {
                items = item?.sizes.map(size => {
                    return {
                        orderId: order.id,
                        productId: item?.id,
                        sizeId: size?.id,
                        count: size?.count
                    };
                });
            } else if (item?.colors?.length > 0) {
                items = item?.colors.map(color => {
                    return {
                        orderId: order.id,
                        productId: item?.id,
                        colorId: color?.id,
                        count: color?.count
                    };
                });
            } else {
                items = [
                    {
                        orderId: order.id,
                        productId: item?.id,
                        count: item?.count,
                    }
                ];
            }
            orderList.push(...items);
        }
        await OrderItems.bulkCreate(orderList);
        const result = await zarinpalRequest(payment?.amount, req?.user);
        return res.json(result);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    paymentBasketHandler
};