import express from "express";
import { getAllOrdersForSeller } from "../controllers/sellerController.js";

const router = express.Router();

router.route('/orders')
    .get(getAllOrdersForSeller)

export default router