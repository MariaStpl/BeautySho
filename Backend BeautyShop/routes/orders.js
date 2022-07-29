const express = require('express');
const connection = require("../connection");
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.get('/get', (req, res, next) => {
    var order = [] ;var fullOrder = []
    var queryCheckout = "SELECT DISTINCT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option, status, orderTime, confirmTime, shipTime, completedTime, receipt, keterangan, createDate from checkout order by id DESC";
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


router.delete('/deleteCheckout/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const checkoutId = req.params.id;
    var query = "delete from checkout where id=?";
    connection.query(query, [checkoutId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Order id does not found" });
            }
            return res.status(200).json({ message: "Order Deleted Successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:checkoutId', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const checkoutId = req.params.checkoutId;
    var query = "delete from orderCart where checkoutId=?";
    connection.query(query, [checkoutId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Order id does not found" });
            }
            return res.status(200).json({ message: "Order Deleted Successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.put('/update', (req, res, next) => {
    let checkout = req.body;
    var queryUpdate = "update checkout set status=?, keterangan=?, createDate=now(), completedTime =if(status ='Package Delivered',now(),completedTime), shipTime =if(status ='Package On Delivery',now(),shipTime), confirmTime =if(status ='Order On Process',now(),confirmTime) where id=?"
    //var query = "update checkout set status=? where id=?";
    //var query = "update checkout set status=?, completedTime= CASE WHENE status = 'To Receive' THEN now(), where id=?";
    connection.query(queryUpdate, [checkout.status, checkout.keterangan, checkout.checkoutId], (err, resultsUpdate) => {
        var keterangan = checkout.keterangan;
        var checkoutId = checkout.checkoutId;
        var queryInsert = "INSERT INTO history (createDate, keterangan, checkoutId) values(now(),?,?)";
        connection.query(queryInsert, [keterangan, checkoutId],(err, resultsInsert) => {

        })
        if (!err) {
            if (!err) {
                if (resultsUpdate.affectedRows == 0) {
                    return res.status(404).json({ message: "Order id does not found" });
                }
                return res.status(200).json({ message: "Order Updated Successfully" });
            }
            else {
                return res.status(500).json(err);
            }
        }
    })
})
module.exports = router;