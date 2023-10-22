import express from "express";
import bodyParser from 'body-parser'
import { config } from 'dotenv'

// Setting up env file
config();

// creating app instance
const app = express();

// Import routes
import authRouter from "./routes/authRoutes.js";
import buyerRouter from "./routes/buyerRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse incoming requests with JSON
app.use(bodyParser.json());

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

// Authentication routes
app.use('/api/auth', authRouter);

// Buyer Routes
app.use('/api/buyer', buyerRouter);

// Seller Rotues
app.use('/api/seller', sellerRouter);

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