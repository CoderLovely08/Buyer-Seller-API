import { createUser } from '../modules/userModule.js';
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {
        const { userName, userPassword, userType } = req.body;

        if (userName && userPassword && userType) {
            const hashedPassword = await bcrypt.hash(userPassword, 10);
            const result = await createUser(userName, hashedPassword, userType);

            res.json({
                success: result.success,
                userId: result.userId,
                message: result.success ? 'Registration Successful' : 'Registration Unsuccessful',
                error: result.error
            })
        } else {
            res.json({
                success: false,
                userId: -1,
                message: 'Invalid Inputs'
            });
        }
    } catch (error) {
        console.error(`Error in registerUser: ${error}`);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
};
