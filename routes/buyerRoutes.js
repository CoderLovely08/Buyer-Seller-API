import express from "express";
import { createOrder, getAllSellers, getSellerCatalogBySellerId } from "../controllers/buyerController.js";

const router = express.Router();

router.route('/list-of-sellers')
    .get(getAllSellers)

router.route('/seller-catalog/:seller_id')
    .get(getSellerCatalogBySellerId)

router.route('/create-order/:seller_id')
    .post(createOrder)
export default router
