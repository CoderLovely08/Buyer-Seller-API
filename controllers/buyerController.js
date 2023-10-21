import { retrieveAllSellers } from '../modules/helperModule.js';

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