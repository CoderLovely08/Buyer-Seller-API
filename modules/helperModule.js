import pool from "../config/dbConfig.js";
/**
 * Creates a new user in the database.
 *
 * @param {string} userName - The username of the new user.
 * @param {string} userPassword - The password of the new user.
 * @param {string} userType - The type of the new user (e.g., 'admin', 'customer', 'seller').
 * @returns {Object} An object containing the result of the operation.
 * @throws {Error} Throws an error if the operation fails.
 *
*/
export const createUser = async (userName, userPassword, userType) => {
    try {
        const query = {
            text: `INSERT INTO UserInfo (user_name, user_password, user_type_name) VALUES ($1, $2, $3) RETURNING user_id`,
            values: [userName, userPassword, userType]
        }
        const { rowCount, rows } = await pool.query(query);

        if (rowCount === 1) {
            return {
                status: 201, // HTTP status for Created
                success: true,
                userId: rows[0]?.user_id,
                message: 'Query Successful',
                error: 'None'
            }
        } else {
            return {
                status: 500, // Internal Server Error
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
                status: 409, // Conflict (Username already exists)
                success: false,
                userId: -1,
                message: 'Username already exists',
                error: error.error
            }

        // Return if the query fails
        return {
            status: 500, // Internal Server Error
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
};

/**
 * To fetch user credentials from the database
 */
export const getUserByUserName = async (userName) => {
    try {
        const query = {
            text: `SELECT user_id, user_type_name, user_password FROM UserInfo WHERE user_name = $1`,
            values: [userName]
        }
        const { rowCount, rows } = await pool.query(query);

        if (rowCount === 1) {
            return {
                status: 200,
                success: true,
                user_id: rows[0].user_id,
                user_password: rows[0].user_password,
                user_type: rows[0].user_type_name,
            };
        } else {
            return {
                status: 404,
                success: false,
            }
        }
    } catch (error) {
        console.error(`Error in getUserByUserName() method: ${error}`);
        // throw error; // Propagate the error to be handled in the route
        return {
            status: 500,
            success: false,
            message: error
        }
    }
};

/**
 * Retrieves information about all sellers from the database.
 *
 * @returns {Object} An object containing the result of the operation.
 * @throws {Error} Throws an error if the operation fails.
 *
 */
export const retrieveAllSellers = async () => {
    try {
        const query = {
            text: `
            SELECT
                user_id AS seller_id, 
                user_name AS seller_name
            FROM UserInfo
            WHERE user_type_name = 'seller'
            `
        }

        const { rowCount, rows } = await pool.query(query);

        return {
            status: 200, // HTTP status for OK
            success: true,
            data: rows,
            count: rowCount
        }
    } catch (error) {
        console.error(`Error in retrieveAllSellers() method: ${error}`);
        // Return if the query fails
        return {
            status: 500,
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
}

/**
 * Retrieves the catalog of products for a specific seller.
 *
 * @param {number} sellerId - The ID of the seller.
 * @returns {Object} An object containing the result of the operation.
 * @throws {Error} Throws an error if the operation fails.
 *
 */
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
            ui.user_id = $1
            AND ui.user_type_name = 'seller';
        `,
            values: [sellerId]
        }

        const { rowCount, rows } = await pool.query(query);
        return {
            status: 200, // HTTP status for OK
            success: true,
            data: rows,
            count: rowCount
        }

    } catch (error) {
        console.error(`Error in retrieveSellerCatalog() method: ${error}`);
        // Return if the query fails
        return {
            status: 500,
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
}

/**
 * Creates a new order for a specific seller and user.
 *
 * @param {number} userId - The ID of the user placing the order.
 * @param {number} sellerId - The ID of the seller.
 * @returns {Object} An object containing the result of the operation.
 * @throws {Error} Throws an error if the operation fails.
 *
 */
export const createOrderBySellerId = async (userId, sellerId) => {
    try {
        // Check if the catalog for the seller exists
        const catalogCheckQuery = {
            text: `SELECT catalog_id FROM CatalogInfo WHERE user_id = $1`,
            values: [sellerId]
        }

        const catalogCheckResult = await pool.query(catalogCheckQuery);

        if (catalogCheckResult.rowCount !== 1) {
            return {
                status: 404, // Not Found
                success: false,
                message: 'Catalog for the seller not found',
            }
        }

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
            status: 200, // HTTP status for OK
            success: rowCount === 1,
            message: rowCount === 1 ? 'Order Successful' : 'Unable to place order',
        }
    } catch (error) {
        console.error(`Error in createOrderBySellerId() method: ${error}`);
        // Return if the query fails
        return {
            status: 500,
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
}

/**
  * Fetches orders for a specific seller.
 *
 * @param {number} sellerId - The ID of the seller.
 * @returns {Object} An object containing the result of the operation.
 * @throws {Error} Throws an error if the operation fails.
 *
 */
export const fetchOrdersBySellerId = async (sellerId) => {
    try {
        const query = {
            text: `
            SELECT 
                oi.order_id,
                ui.user_id,
                ui.user_name AS buyer_name,
                pi.product_name,
                pi.product_price,
                oi.created_at
            FROM
                OrderInfo oi
            JOIN UserInfo ui
                On ui.user_id = oi.user_id
            JOIN CatalogInfo ci
                ON oi.catalog_id = ci.catalog_id
            JOIN ProductsInfo pi
                ON ci.catalog_id = pi.catalog_id
            WHERE ci.user_id = $1
                ORDER BY oi.order_id
            `,
            values: [sellerId]
        }
        const { rows } = await pool.query(query);

        return {
            status: 200, // HTTP status for OK
            success: true,
            data: rows
        }
    } catch (error) {
        console.error(`Error in createOrderBySellerId() method: ${error}`);
        // Return if the query fails
        return {
            status: 500,
            success: false,
            userId: -1,
            message: 'Internal Server Error',
            error: error
        }
    }
}

/**
 * Creates a catalog for a seller and adds products to it.
 *
 * @param {number} userId - The ID of the seller.
 * @param {Array<Object>} products - An array of product objects containing name and price.
 * @returns {Object} An object containing the result of the operation.
 * @throws {Error} Throws an error if the operation fails.
 *
 */
export const createCatalogForProducts = async (userId, products) => {
    const client = await pool.connect()

    try {
        // Initiate transaction
        await client.query('BEGIN');
        const catalogIdQuery = {
            text: `INSERT INTO CatalogInfo(user_id) VALUES ($1) RETURNING catalog_id`,
            values: [userId]
        }

        const catalogIdResults = await client.query(catalogIdQuery);

        if (catalogIdResults.rowCount != 1) {
            // Rollback transaction
            await client.query('ROLLBACK')
            return {
                status: 500,
                success: false,
                message: 'Unable to create catalog'
            }
        }

        if (catalogIdResults.rowCount == 1 && products.length > 0) {
            const catalogId = catalogIdResults.rows[0]?.catalog_id;

            let productsInsertQuery = `
            INSERT INTO
            ProductsInfo(product_name, product_price, catalog_id)
            VALUES ${products.map(product => { return `('${product.name}', '${product.price}', ${catalogId})` }).join(',')}`

            const { rowCount } = await client.query(productsInsertQuery);
            if (rowCount >= 1) {
                await client.query('COMMIT');
                return {
                    status: 201, // HTTP status for OK
                    success: true,
                    message: 'Catalog created successfully'
                }
            } else {
                throw Error
            }
        }

    } catch (error) {
        await client.query('ROLLBACK')
        console.error(`Error in createCatalogForProducts() method: ${error}`);

        if (error.constraint.includes('cataloginfo_user_id_key')) {
            return {
                status: 409,
                success: false,
                message: 'Catalog already exists',
                error: error
            }
        }

        if (error.constraint.includes('cataloginfo_user_id_fkey')) {
            return {
                status: 404,
                success: false,
                message: 'Seller does not exists',
                error: error
            }
        }
        // Return if the query fails
        return {
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: error
        }
    } finally {
        client.release();
    }
}

/**
 * Retrieves information about all users.
 *
 * @returns {Object} An object containing the result of the operation.
 * @throws {Error} Throws an error if the operation fails.
 *
 */
export const getAllUsers = async () => {
    try {
        const query = {
            text: `SELECT * FROM UserInfo`
        }

        const { rows } = await pool.query(query);
        return {
            status: 200, // HTTP status for OK
            success: true,
            userCount: rows.length,
            data: rows
        }
    } catch (error) {
        // Return if the query fails
        return {
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: error
        }
    }
}