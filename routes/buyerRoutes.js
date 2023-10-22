import express from "express";
import { createOrder, getAllSellers, getSellerCatalogBySellerId } from "../controllers/buyerController.js";
import { authenticateUser, authorizeUser } from "../middlewares/authUser.js";

const router = express.Router();

router.route('/list-of-sellers')
    .get(authenticateUser, authorizeUser('buyer'), getAllSellers)

router.route('/seller-catalog/:seller_id')
    .get(authenticateUser, authorizeUser('buyer'), getSellerCatalogBySellerId)

router.route('/create-order/:seller_id')
    .post(authenticateUser, authorizeUser('buyer'), createOrder)
export default router
