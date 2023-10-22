import express from "express";
import { getAllSellers, getSellerCatalogBySellerId } from "../controllers/buyerController.js";

const router = express.Router();

router.route('/list-of-sellers')
    .get(getAllSellers)

router.route('/seller-catalog/:seller_id')
    .get(getSellerCatalogBySellerId)

export default router
