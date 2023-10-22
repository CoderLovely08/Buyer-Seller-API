import express from "express";
import { registerUser, validateUser } from "../controllers/userController.js";
import { getAllUsers } from "../modules/helperModule.js";

const router = express.Router();

router.route('/users')
    .get(async (req, res) => {
        try {
            const result = await getAllUsers();
            res.json({
                result
            })
        } catch (error) {
            // Return if the query fails
            return {
                success: false,
                message: 'Internal Server Error',
                error: error
            }
        }
    })

router.route('/register')
    .post(registerUser)

router.route('/login')
    .post(validateUser)
export default router