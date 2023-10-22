import { createUser, getUserByUserName } from '../modules/helperModule.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { config } from 'dotenv'

// Setting up env file
config();

/**
 * Registers a user by creating a new user record in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 *
 * @example
 * registerUser(req, res);
 */
export const registerUser = async (req, res) => {
    try {
        const { userName, userPassword, userType } = req.body;

        if (userName && userPassword && userType) {
            const hashedPassword = await bcrypt.hash(userPassword, 10);
            const result = await createUser(userName, hashedPassword, userType);

            res.json({
                status: result.status,
                success: result.success,
                userId: result.userId,
                message: result.status == 409 ? 'Username already exists' : result.status == 200 ? 'Registration successful' : 'Registration Unsuccessul',
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


export const validateUser = async (req, res) => {
    try {
        const { userName, userPassword } = req.body;

        // Check if both userName and userPassword are provided
        if (!userName || !userPassword) {
            return res.status(400).json({ success: false, message: 'Invalid Inputs' });
        }

        // Get user information from the database
        const user = await getUserByUserName(userName);

        // Check if user exists
        if (!user.success && user.status == 404) {
            return res.status(401).json({ success: false, message: 'Invalid Username or Password' });
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(userPassword, user.user_password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid Username or Password' });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user.user_id, userType: user.user_type },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, token });

    } catch (error) {
        console.error(`Error in /auth/login route: ${error}`);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};