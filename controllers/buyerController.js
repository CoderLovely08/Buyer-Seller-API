import { createOrderBySellerId, retrieveAllSellers, retrieveSellerCatalog } from '../modules/helperModule.js';

/**
 * Retrieves information about all sellers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 *
 * @example
 * getAllSellers(req, res);
 */
export const getAllSellers = async (req, res) => {
    try {
        const result = await retrieveAllSellers();
        res.json({
            status: result.status,
            success: result.success,
            count: result.count,
            data: result.data,
        })

    } catch (error) {
        console.error(`Error in getAllSellers() method: ${error}`);
        res.json({
            success: false,
            error: error,
        })
    }
}

/**
 * Retrieves the catalog of products for a specific seller.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 *
 * @example
 * getSellerCatalogBySellerId(req, res);
 */
export const getSellerCatalogBySellerId = async (req, res) => {
    try {
        const sellerId = req.params.seller_id;

        const result = await retrieveSellerCatalog(sellerId);
        const resultMap = new Map();

        result.data.forEach(item => {
            const { seller_id, seller_name } = item;
            if (!resultMap.get(seller_id)) {
                resultMap.set(seller_id, {
                    seller_id: seller_id,
                    seller_name: seller_name,
                    products: []
                })
            }

            if (item.product_id) {
                let productItem = {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    product_price: item.product_price
                }

                resultMap.get(seller_id).products.push(productItem)
            }
        })

        const productsResult = {
            count: Array.from(resultMap.values())[0]?.products.length,
            ...Array.from(resultMap.values())[0]
        }

        res.json({
            status: result.status,
            success: result.success,
            data: productsResult,
        })

    } catch (error) {
        console.error(`Error in getSellerCatalogBySellerId() method: ${error}`);
        res.json({
            success: false,
            error: error,
        })
    }
}

/**
 * Creates an order for a specific seller based on the request body.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 *
 * @example
 * createOrder(req, res);
 */
export const createOrder = async (req, res) => {
    try {
        const sellerId = req.params.seller_id;

        const userId = req.user.userId;
        const result = await createOrderBySellerId(userId, sellerId);

        res.json({
            status: result.status,
            success: result.success,
            message: result.message,
            error: result.error
        })

    } catch (error) {
        console.error(`Error in createOrder() method: ${error}`);
        res.json({
            success: false,
            error: error,
        })
    }
}