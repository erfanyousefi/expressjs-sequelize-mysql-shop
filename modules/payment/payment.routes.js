const {Router} = require("express");
const AuthGuard = require("../auth/auth.guard");
const {paymentBasketHandler} = require("./payment.service");

const router = Router();
router.post("/", AuthGuard, paymentBasketHandler);
module.exports = {
    paymentRoutes: router
};