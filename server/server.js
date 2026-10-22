const express = require('express');
const app = express();

require('dotenv').config({quiet:true});

const connectDB = require('./src/config/db');

connectDB();

app.get("/",(req,res)=>{
    res.send("This is home page");
});

app.listen(3000,()=>{
    console.log("Server is listening at port http://localhost:3000");
})
