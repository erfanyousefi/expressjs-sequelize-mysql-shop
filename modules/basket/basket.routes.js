const {Router} = require("express");
const AuthGuard = require("../auth/auth.guard");
const {addToBasketHandler, getUserBasketHandler} = require("./basket.service");

const router = Router();

router.post("/add", AuthGuard, addToBasketHandler);
router.get("/", AuthGuard, getUserBasketHandler);
module.exports = {
    basketRoutes: router
};