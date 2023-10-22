import { createCatalogForProducts, fetchOrdersBySellerId } from "../modules/helperModule.js";
import jwt from 'jsonwebtoken'

/**
 * Retrieves all orders for a specific seller, organizes them by order ID, and includes product details.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 *
 * @example
 * getAllOrdersForSeller(req, res);
 */
export const getAllOrdersForSeller = async (req, res) => {
    try {

        // Get the seller id from req.user
        const sellerId = req.user.userId;

        // Fetch results
        const result = await fetchOrdersBySellerId(sellerId);
        // Process results for pretty view
        const resultMap = new Map();

        result.data.forEach(item => {
            const { order_id, user_id, buyer_name } = item;
            if (!resultMap.get(order_id)) {
                resultMap.set(order_id, {
                    order_id: order_id,
                    buyer_id: user_id,
                    buyer_name: buyer_name,
                    products: [],
                    order_time: new Date(item.created_at).toLocaleTimeString()
                })
            }

            let productItem = {
                product_name: item.product_name,
                product_price: item.product_price,
            }

            resultMap.get(order_id).products.push(productItem);
        })

        // Send response
        res.json({
            status: result.status,
            success: result.success,
            totalOrders: Array.from(resultMap.values()).length,
            orders: Array.from(resultMap.values())
        })

    } catch (error) {
        console.error(`Error in getAllOrdersForSeller() method: ${error}`);
        res.json({
            success: false,
            error: error,
        })
    }
}

/**
 * Creates a catalog for a seller and adds products to it based on the request body.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 *
 * @example
 * createProductsCatalog(req, res);
 */
export const createProductsCatalog = async (req, res) => {
    try {

        // Get the data
        const { products } = req.body;

        const userId = req.user.userId;

        const result = await createCatalogForProducts(userId, products);

        res.json({
            status: result.status,
            success: result.success,
            message: result.message
        })

    } catch (error) {
        console.error(`Error in createProductsCatalog() method: ${error}`);
        res.json({
            success: false,
            error: error,
        })
    }
}