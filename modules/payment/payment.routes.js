const {Router} = require("express");
const AuthGuard = require("../auth/auth.guard");
const {paymentBasketHandler, paymentVerifyHandler} = require("./payment.service");

const router = Router();
router.post("/", AuthGuard, paymentBasketHandler);
router.get("/callback", paymentVerifyHandler);
module.exports = {
    paymentRoutes: router
};