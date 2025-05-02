let axios = require("axios");
let express = require("express");
let app = express();
let stocks;

// http://localhost:8080/findStockDetails/MMM
// http://localhost:8080/findStockDetails/MNST
//IF9FW9PP7AH7W59K alphavantage
//d02j031r01qi6jghc2ngd02j031r01qi6jghc2o0 finnhub

app.get("/findStockDetails/:symbol", (req, res) => {
    let stockSymbol = req.params.symbol;
    let stockDetails = stocks.find((stock) => stock.symbol === stockSymbol);
    if(stockDetails==undefined){
        res.status(404).send("Stock not found");
    }else {
        // write the code to store that stock details in database using mongodb or mongoose modules 
        //res.json(stockDetails);
        res.json("Stock details stored in database successfully");
    }
})
// another end point to get all the stocks details from database

app.listen(8080, async () => {
    console.log("Server is running on port 8080");
    let url = "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=d02j031r01qi6jghc2ngd02j031r01qi6jghc2o0";
    
    let response = await axios.get(url);
    stocks = response.data;
    console.log("Stocks data fetched from server:", stocks.length, "stocks");
})