import express from "express";
import { config } from 'dotenv'

// Setting up env file
config();

// creating app instance
const app = express();

// parse incoming requests with JSON
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    try {
        res.status(200).json({
            statusCode: 200,
            message: "Hey there"
        })
    } catch (error) {
        console.error(`Error in GET / route: ${error}`);
        res.status(501).json({
            statusCode: 501,
            message: "Internal Server Error"
        })
    }
})


// Irrelevant route
app.get('/*', (req, res) => {
    try {
        res.status(404).json({
            statusCode: 404,
            message: "The page you requested does not exists"
        })
    } catch (error) {
        console.error(`Error in GET /* route: ${error}`);
        res.status(501).json({
            statusCode: 501,
            message: "Internal Server Error"
        })
    }
})

// Listening for requests
app.listen(process.env.PORT || 3000, (error) => {
    if (error) console.error(error);
    console.log(`Server is running on port ${process.env.PORT}`);
})