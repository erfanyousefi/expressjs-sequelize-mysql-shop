const {Router} = require("express");
const AuthGuard = require("../auth/auth.guard");
const {getMyOrdersHandler, getOneOrderByIdHandler, setPackedStatusToOrder, setInTransitStatusToOrder, setCanceledStatusToOrder, setDeliveryStatusToOrder} = require("./order.service");

const router = Router();
router.get("/", AuthGuard, getMyOrdersHandler);
router.get("/:id", AuthGuard, getOneOrderByIdHandler);
router.patch("/set-packed/:id", AuthGuard, setPackedStatusToOrder);
router.patch("/set-in-transit/:id", AuthGuard, setInTransitStatusToOrder);
router.patch("/set-delivery/:id", AuthGuard, setDeliveryStatusToOrder);
router.patch("/cancel/:id", AuthGuard, setCanceledStatusToOrder);
module.exports = {
    orderRoutes: router
};