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

export const retrieveAllSellers = async () => {
    try {
        const query = {
            text: `
            SELECT user_id, user_name 
            FROM UserInfo
            WHERE user_type_name = 'seller'
            `
        }

        const { rowCount, rows } = await pool.query(query);

        return {
            success: true,
            data: rows,
            count: rowCount
        }
    } catch (error) {
        console.error(`Error in retrieveAllSellers() method: ${error}`);
        // Return if the query fails
        return {
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
}

export const retrieveSellerCatalog = async (sellerId) => {
    try {
        const query = {
            text: `
        SELECT 
            ui.user_id AS seller_id,
            ui.user_name AS seller_name,
            pi.product_id,
            pi.product_name,
            pi.product_price
        FROM 
            UserInfo ui
        LEFT JOIN 
            CatalogInfo ci ON ci.user_id = ui.user_id
        LEFT JOIN 
            ProductsInfo pi ON pi.catalog_id = ci.catalog_id
        WHERE 
            ui.user_id = $1;
        `,
            values: [sellerId]
        }

        const { rowCount, rows } = await pool.query(query);
        return {
            success: true,
            data: rows,
            count: rowCount
        }

    } catch (error) {
        console.error(`Error in retrieveSellerCatalog() method: ${error}`);
        // Return if the query fails
        return {
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
}


export const createOrderBySellerId = async (userId, sellerId) => {
    try {
        const query = {
            text: `
                INSERT INTO OrderInfo(user_id, catalog_id) VALUES(
                    $1,
                    (SELECT catalog_id FROM CatalogInfo WHERE user_id = $2)
                )
                `,
            values: [userId, sellerId]
        }

        const { rowCount } = await pool.query(query);

        return {
            success: rowCount === 1,
            message: rowCount === 1 ? 'Order Successful' : 'Unable to place order',
        }
    } catch (error) {
        console.error(`Error in createOrderBySellerId() method: ${error}`);
        // Return if the query fails
        return {
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
}