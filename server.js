let express = require("express");   // load the express module 
let mongoDb = require("mongodb");   // load the mongodb module
let app = express();                // create an express application    

// middleware to parse JSON data from the request body
app.use(express.json()); // parse JSON data from the request body

// database URL 
let url ="mongodb://localhost:27017"; // URL to connect to the database, 27017 is the default port for MongoDB
let dbName = "stock_db"; // name of the database to connect to

// connect the mongodb database
let mongoClient = mongoDb.MongoClient; // create a mongoClient object, which provides methods to connect to the database
let db; // variable to hold the database object
// ready to connect to the database 
mongoClient.connect(url).
then(client=> {
    db = client.db(dbName);// connect to the database using the client object
    console.log("Stock Database connected successfully");
}).
catch(error=>
    {
        console.log(error);
}); 
// connect to the database and catch any errors

// store the production information in stock_db collection 
// http://localhost:3001/storeStock
// data format :{_id:1,name:"Tesla",symbol:"TSLA","price":275,"quantity":100}

app.post("/storeStock",async (req,res)=> {
    try{
    let newStock = req.body; // get the stock information from the request body
    console.log(newStock); // log the stock information to the console
    //res.send("done")
    let result = await db.collection("stock").insertOne(newStock);  // db.product.insertOne(newStock) // insert the stock information into the stock collection
    res.json({"msg":result});
    }catch(error){
        res.json({"msg":error});
    }    
});

// find the all stock information from the database
// http://localhost:3001/findStock

app.get("/findStock",async (req, res)=> {
    try{
    let result = await db.collection("stock").find().toArray(); // find all documents in the stock collection
    // let result = await db.collection("stock").find().forEach((doc)=>{
    //     console.log(doc);       // display result on console server side 
    // })
    res.json(result);
    }catch(error){
        res.json({"msg":error});
    }
})

// search the stock information base upon stock id 
// http://localhost:3001/findStock/1
// http://localhost:3001/findStock/100

app.get("/findStockDetails/:symbol", async (req, res) => {
    try {
        let symbol = req.params.symbol; // Get the stock symbol from the request parameters
        let result = await db.collection("stock").findOne({ symbol: symbol }); // Search by symbol
        if (result == null) {
            res.json({ "msg": "Stock not found" }); // If stock not found, send a message to the client
        } else {
            res.json(result); // If stock found, send the stock information to the client
        }
    } catch (error) {
        res.json({ "msg": error });
    }
});

// delete the stock information from the database using stock id ie _id 
// http://localhost:3001/deleteStock/1
// http://localhost:3001/deleteStock/100

app.delete("/deleteStock/:id",async (req,res)=> {
    try{
        let pid = req.params.id; // get the stock id from the request parameters
        let result = await db.collection("stock").deleteOne({_id:Number(pid)});
        //res.json({"msg":result}); // send the result of the delete operation to the client  
        if(result.deletedCount==1){
            res.json({"msg":"Stock deleted successfully"});
        }else{
            res.json({"msg":"Stock not found"});
        }
    }catch(error){
        res.json({"msg":error});    
    }
    })
    // update the stock information using stock id ie _id
    // http://localhost:3001/updateStock/1
    
    app.put("/updateStock/:id",async (req,res)=> {
        try{
        let pid = req.params.id;
        let toUpdateNewStock = req.body;
        let result = await db.collection("stock").
        updateOne({_id:Number(pid)},{$set:toUpdateNewStock});  
         //res.json({msg:result}); // send the result of the update operation to the client
        if(result.modifiedCount==1){
            res.json({"msg":"Stock updated successfully"});
        }else if(result.matchedCount==1){
            res.json({"msg":"Stock present, but didn't update because old and new data are same"});
        }else {
            res.json({"msg":"Stock not found"}); // if stock not found, send a message to the client    
    
        }
        }catch(error){
            res.json({"msg":error});
        }
    });
    
    app.listen(3001, () => {
        console.log("Server running at port 3001");
    });