const express = require('express');
const { localeData } = require('moment');
const { response } = require('..');
const connection = require("../connection");
const router = express.Router();

router.get('/get', (req, res, next) => {
    var query = "SELECT cart.id, cart.itemId, cart.productId, cart.quantity, cart.total, detail_product.id as itemId, detail_product.item as itemSize, detail_product.description as itemDesc, detail_product.price as itemPrice, detail_product.image as itemImage, product.name as productName, product.id as productId FROM cart, detail_product, product WHERE cart.itemId=detail_product.id AND detail_product.productId = product.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.post('/post', (req, res, next) => {
    var query = "insert into checkout (name,email,contactNumber,paymentMethod, address, shipping_option, status, orderTime, shipTime, completedTime) values(?,?,?,?,?,?,'To Ship',now(),NULL,NULL)";
    let checkout = req.body;
    connection.query(query, [checkout.name, checkout.email, checkout.contactNumber, checkout.paymentMethod, checkout.address, checkout.shipping_option], (err, results) => {
        var query = "INSERT INTO orderCart (checkoutId, itemId, productId, quantity, itemPrice, total) SELECT ?, cart.itemId, cart.productId, cart.quantity, cart.itemPrice, cart.total FROM cart"
        connection.query(query, results.insertId, (err, results) => {
            if (!err) {
                if (!err) {
                    return res.status(200).json({ message: "Product Updated Successfully" });
                }
                else {
                    return res.status(500).json(err);
                }
            }
        })

        var query = "insert into notification (notif, checkoutId, orderTime, status) values('just made a new order.',?,now(),'new')"
        connection.query(query, results.insertId, (err, results) => {
        })

    })

})

router.delete('/deleteAll', (req, res, next) => {
    var query = "delete from cart";
    connection.query(query, (err, results) => {
        console.log(results);
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/remove', (req, res, next) => {
    var query = "delete from orderCart";
    connection.query(query, (err, results) => {
        console.log(results);
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;