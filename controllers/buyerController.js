import { retrieveAllSellers, retrieveSellerCatalog } from '../modules/helperModule.js';

export const getAllSellers = async (req, res) => {
    try {
        const result = await retrieveAllSellers();
        res.json({
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

export const getSellerCatalogBySellerId = async (req, res) => {
    try {
        const sellerId = req.params.seller_id;

        const result = await retrieveSellerCatalog(sellerId);

        res.json({
            success: result.success,
            count: result.count,
            products: result.data,
        })
    } catch (error) {
        console.error(`Error in getSellerCatalogBySellerId() method: ${error}`);
        res.json({
            success: false,
            error: error,
        })
    }
}