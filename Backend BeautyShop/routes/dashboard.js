const express = require('express');
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.get('/details',auth.authenticateToken,(req, res, next)=>{
    var categoryCount;
    var productCount;
    var userCount;
    var ordersCount;
    var detailCount;

    var query = "select count(DISTINCT checkoutId) as ordersCount from orderCart";
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

    var query = "select count(id) as userCount from user where role='user'";
    connection.query(query,(err,results)=>{
        if(!err){
            userCount = results[0].userCount;
            var data ={
                category : categoryCount,
                product : productCount,
                user : userCount,
                orders: ordersCount,
                item : detailCount
            };

            return res.status(200).json(data);
        }
        else{
            return res.status(500).json(err); 
        }
    })

    router.get('/topProduct',(req, res, next)=>{
        var query = "SELECT productId, name, SUM(quantity) as total FROM orderCart INNER JOIN product ON orderCart.productId = product.id GROUP BY productId ORDER BY SUM(quantity) DESC LIMIT 5;"
        connection.query(query, (err, results)=>{
            if(!err){
                return res.status(200).json(results);
            }
            else{
                return res.status(500).json(err);
            }
        })
    })

    router.get('/topItem',(req, res, next)=>{
        var query = "SELECT o.id, o.itemId, o.productId, o.quantity, d.item as itemSize, p.name as productName, p.id as productId, SUM(o.quantity) as total FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id) INNER JOIN product as p ON d.productId = p.id) GROUP BY itemSize ORDER BY SUM(o.quantity) DESC LIMIT 5";
        // var query = "SELECT id, productId, itemId, COUNT(itemId) as total FROM orderCart GROUP BY itemId ORDER BY COUNT(itemId) DESC LIMIT 5;"
        connection.query(query, (err, results)=>{
            if(!err){
                return res.status(200).json(results);
            }
            else{
                return res.status(500).json(err);
            }
        })
    })


    router.get('/get', (req, res, next) => {
        var order = [] ;var fullOrder = []
        var queryCheckout = "SELECT DISTINCT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option, status, orderTime, confirmTime, shipTime, completedTime, receipt, keterangan, createDate from checkout order by id DESC LIMIT 10";
        connection.query(queryCheckout, (err, resultsCheckout) => {
            if (resultsCheckout) {
                order = resultsCheckout.map(v => Object.assign({}, v))
    
                fullOrder =  order.map(( mapOrder) => {
                    var queryitems = "SELECT o.id, o.itemId, o.productId, o.quantity, o.total, o.checkoutId, d.id as itemId, d.item as itemSize,  d.price as itemPrice, d.description as itemDesc, p.name as productName, p.id as productId FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id)INNER JOIN product as p ON d.productId = p.id) where o.checkoutId = ?"
                    connection.query(queryitems, mapOrder.checkoutId, (err, resultsOrder) => {
                        mapOrder.items = resultsOrder.map( v => Object.assign({}, v));
    
                    })
                    return mapOrder
                });
    
            }
            setTimeout(() => {
                if (!err) {
                    return res.status(200).json(fullOrder);
                }
                else {
                    return res.status(500).json(err);
                }
    
            }, 2000);
        })
    })
    


    // var query = "select count(id) as billCount from bill";
    // connection.query(query,(err,results)=>{
    //     if(!err){
    //         billCount = results[0].billCount;
    //         var data ={
    //             category : categoryCount,
    //             product : productCount,
    //             bill : billCount,
    //             orders: ordersCount,
    //             item : detailCount
    //         };

    //         return res.status(200).json(data);
    //     }
    //     else{
    //         return res.status(500).json(err); 
    //     }
    // })
})


module.exports = router;