import pool from "../config/dbConfig.js";

export const createUser = async (userName, userPassword, userType) => {
    try {
        const query = {
            text: `INSERT INTO UserInfo (user_name, user_password, user_type_name) VALUES ($1, $2, $3) RETURNING user_id`,
            values: [userName, userPassword, userType]
        }
        const { rowCount, rows } = await pool.query(query);

        if (rowCount === 1) {
            return {
                success: true,
                userId: rows[0]?.user_id,
                message: 'Query Successful',
                error: 'None'
            }
        } else {
            return {
                success: false,
                userId: -1,
                message: 'Query Successful',
                error: 'None'
            }
        }
    } catch (error) {

        // Check if username already exists
        if (error.constraint.includes('userinfo_user_name_key'))
            return {
                success: false,
                userId: -1,
                message: 'Username already exists',
                error: error.error
            }

        // Return if the query fails
        return {
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
};