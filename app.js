let axios = require("axios");
let express = require("express");
let mongoDb = require("mongodb");   // load the mongodb module
let mongoose = require("mongoose"); // load the mongoose module
let app = express();
let stocks; 
let dotenv = require('dotenv');
dotenv.config();

let PORT = process.env.PORT || 8080;  // Set port


// middleware to parse JSON data from the request body
app.use(express.json()); // parse JSON data from the request body
// database URL
let url = process.env.MONGO_URI; // URL to connect to the database, 27017 is the default port for MongoDB
let dbName = "stock_db"; // name of the database to connect to
// connect the mongodb database
let mongoClient = mongoDb.MongoClient; // create a mongoClient object, which provides methods to connect to the database
let db; // variable to hold the database object
// ready to connect to the database
mongoClient.connect(url)
    .then(client => {
        db = client.db(dbName); // connect to the database using the client object
        console.log("Stock Database connected successfully");
    })
    .catch(error => {
        console.log(error);
    });
// connect to the database and catch any errors
// store the production information in stock_db collection
// http://localhost:8080/storeStock
// data format :{_id:1,name:"Tesla",symbol:"TSLA","price":275,"quantity":100}
app.post("/storeStock", async (req, res) => {
    try {
        let newStock = req.body; // get the stock information from the request body
        console.log(newStock); // log the stock information to the console
        //res.send("done")
        let result = await db.collection("stock").insertOne(newStock);  // db.product.insertOne(newStock) // insert the stock information into the stock collection
        res.json({ "msg": result });
    } catch (error) {
        res.json({ "msg": error });
    }   
})
console.log(process.env.MONGO_URI); // Print mongo uri

// http://localhost:8080/findStockDetails/MMM
// http://localhost:8080/findStockDetails/MNST
//IF9FW9PP7AH7W59K alphavantage
//d02j031r01qi6jghc2ngd02j031r01qi6jghc2o0 finnhub

app.get("/findStockDetails/:symbol", async (req, res) => {
    try {
        let stockSymbol = req.params.symbol;
        let stockDetails = await db.collection("stock").findOne({ symbol: stockSymbol });

        if (!stockDetails) {
            res.status(404).json({ msg: "Stock not found" });
        } else {
            res.json(stockDetails);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
// search the stock information base upon stock id
// find the all stock information from the database
// http://localhost:8080/findStock
// http://localhost:8080/findStock/1

app.get("/findStock", async (req, res) => {
    try {
        let allStocks = await db.collection("stock").find().toArray();
        res.json(allStocks);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// another end point to get all the stocks details from database

app.listen(8080, async () => {  // Start server
    console.log("Server is running on port 8080");
    let url = "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=d02j031r01qi6jghc2ngd02j031r01qi6jghc2o0";
    
    try {
        let response = await axios.get(url);
        stocks = response.data;
        console.log("Stocks data fetched from server:", stocks.length, "stocks");

        // Insert stocks into MongoDB
        const result = await db.collection("stock").insertMany(stocks, { ordered: false });
        console.log(`Inserted ${result.insertedCount} stocks into the database`);
    } catch (error) {
        console.error("Error fetching or inserting stocks:", error.message);
    }
});