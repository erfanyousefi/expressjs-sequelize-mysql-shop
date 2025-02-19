const createHttpError = require("http-errors");
const {OrderStatus} = require("../../common/constant/order.const");
const {getUserBasketById} = require("../basket/basket.service");
const {Order, OrderItems} = require("../order/order.model");
const {zarinpalRequest, zarinpalVerify} = require("../services/zarinpal.service");
const {Payment} = require("./payment.model");
const {Basket} = require("../basket/basket.model");

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
        payment.authority = result?.authority;
        await payment.save();
        return res.json(result);
    } catch (error) {
        next(error);
    }
}
async function paymentVerifyHandler (req, res, next) {
    try {
        const {Authority, Status} = req?.query;
        console.log(req?.query);
        // status: OK - NOK
        if (Status === "OK" && Authority) {
            const payment = await Payment.findOne({where: {authority: Authority}});
            if (!payment) throw createHttpError(404, "payment not found");
            const result = await zarinpalVerify(payment?.amount, payment?.authority);
            if (result) {
                payment.status = true;
                payment.refId = result?.ref_id ?? "32456";
                const order = await Order.findByPk(payment.orderId);
                if (!order) throw createHttpError(404, "not found order");
                order.status = OrderStatus.InProcess;
                await order.save();
                await payment.save();
                await Basket.destroy({where: {userId: order.userId}});
                return res.redirect("http://frontenddomain.com/payment?status=success");
            } else {
                await Payment.destroy({where: {id: payment?.id}});
                await Order.destroy({where: {id: payment?.orderId}});
            }
        }
        return res.redirect("https://frontenddomain.com/payment?status=failure");
    } catch (error) {
        res.redirect("https://frontenddomain.com/payment?status=failure");
    }
}
module.exports = {
    paymentBasketHandler,
    paymentVerifyHandler
};