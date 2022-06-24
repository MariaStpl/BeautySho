const express = require('express');
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.get('/details',auth.authenticateToken,(req, res, next)=>{
    var categoryCount;
    var productCount;
    var billCount;
    var ordersCount;
    var detailCount;

    var query = "select count(DISTINCT checkoutId) as ordersCount from orderCart WHERE MONTH(orderTime) = 6";
    connection.query(query,(err,results)=>{
        if(!err){
            ordersCount = results[0].ordersCount;
        }
        else{
            return res.status(500).json(err); 
        }
    })

    var query = "select count(id) as categoryCount from category";
    connection.query(query,(err,results)=>{
        if(!err){
            categoryCount = results[0].categoryCount;
        }
        else{
            return res.status(500).json(err); 
        }
    })

    var query = "select count(id) as detailCount from detail_product";
    connection.query(query,(err,results)=>{
        if(!err){
            detailCount = results[0].detailCount;
        }
        else{
            return res.status(500).json(err); 
        }
    })

    var query = "select count(id) as productCount from product";
    connection.query(query,(err,results)=>{
        if(!err){
            productCount = results[0].productCount;
        }
        else{
            return res.status(500).json(err); 
        }
    })


    var query = "select count(id) as billCount from bill";
    connection.query(query,(err,results)=>{
        if(!err){
            billCount = results[0].billCount;
            var data ={
                category : categoryCount,
                product : productCount,
                bill : billCount,
                orders: ordersCount,
                item : detailCount
            };

            return res.status(200).json(data);
        }
        else{
            return res.status(500).json(err); 
        }
    })
})


module.exports = router;