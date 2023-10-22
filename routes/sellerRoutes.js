import express from "express";
import { createProductsCatalog, getAllOrdersForSeller } from "../controllers/sellerController.js";
import { authenticateUser, authorizeUser } from "../middlewares/authUser.js";

const router = express.Router();

router.route('/orders')
    .get(authenticateUser, authorizeUser('seller'), getAllOrdersForSeller)


router.route('/create-catalog')
    .post(authenticateUser, authorizeUser('seller'), createProductsCatalog)
export default router