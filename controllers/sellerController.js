import { fetchOrdersBySellerId } from "../modules/helperModule.js";

export const getAllOrdersForSeller = async (req, res) => {
    try {
        // Get this from token
        const sellerId = req.query.seller_id;

        const result = await fetchOrdersBySellerId(sellerId);
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


        res.json({
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