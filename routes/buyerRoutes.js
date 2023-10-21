import express from "express";
import { getAllSellers } from "../controllers/buyerController.js";

const router = express.Router();

router.route('/list-of-sellers')
    .get(getAllSellers)

export default router
