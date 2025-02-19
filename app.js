const {config} = require("dotenv");
const express = require("express");
const initDatabase = require("./config/models.initial");
const {productRoutes} = require("./modules/product/product.routes");
const {authRoutes} = require("./modules/auth/auth.routes");
const {basketRoutes} = require("./modules/basket/basket.routes");
const {paymentRoutes} = require("./modules/payment/payment.routes");
const {orderRoutes} = require("./modules/order/order.routes");
const {rbacRoutes} = require("./modules/RBAC/rbac.routes");
config();
async function main () {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    await initDatabase();
    app.use("/auth", authRoutes);
    app.use("/product", productRoutes);
    app.use("/basket", basketRoutes);
    app.use("/payment", paymentRoutes);
    app.use("/order", orderRoutes);
    app.use("/rbac", rbacRoutes);
    app.use((req, res, next) => {
        return res.status(404).json({
            message: "not found route"
        });
    });
    app.use((err, req, res, next) => {
        const status = err?.status ?? err?.statusCode ?? 500;
        let message = err?.message ?? "internal server error";
        if (err?.name == "ValidationError") {
            const {details} = err;
            message = details?.body?.[0]?.message ?? "internal server error";
        }
        return res.status(status).json({
            message,
        });
    });
    let port = process.env.PORT ?? 3000;
    app.listen(port, () => {
        console.log("server run: http://localhost:" + port);
    });
}
main();