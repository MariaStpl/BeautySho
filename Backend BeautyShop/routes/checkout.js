const express = require('express');
const { response } = require('..');
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

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
    const dateObj = new Date();
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    month = ('0' + month).slice(-2); // To make sure the month always has 2-character-formate. For example, 1 => 01, 2 => 02    
    let date = dateObj.getDate();
    date = ('0' + date).slice(-2); // To make sure the date always has 2-character-formate
    let hour = dateObj.getHours();
    hour = ('0' + hour).slice(-2); // To make sure the hour always has 2-character-formate
    let minute = dateObj.getMinutes();
    minute = ('0' + minute).slice(-2);
    let second = dateObj.getSeconds();
    second = ('0' + second).slice(-2);
    const time = `${year}${month}${date}${hour}${minute}${second}`;

    var c = Math.round(100 + (Math.random() * 99999));

    var numberOrder = 'ORD-' + time + '-' + c.toString()

    var query = "insert into checkout (name,email,contactNumber,paymentMethod, address, shipping_option, status, orderTime, confirmTime, shipTime, completedTime, keterangan, createDate, receipt, userId) values (?,?,?,?,?,?,'Waiting Confirmation',now(),NULL,NULL,NULL,NULL,NULL,?,?)";
    let checkout = req.body;
    connection.query(query, [checkout.name, checkout.email, checkout.contactNumber, checkout.paymentMethod, checkout.address, checkout.shipping_option, numberOrder, checkout.userId], (err, results) => {
        var query = "INSERT INTO orderCart (checkoutId, itemId, productId, quantity, itemPrice, total) SELECT ?, cart.itemId, cart.productId, cart.quantity, cart.itemPrice, cart.total FROM cart"
        connection.query(query, results.insertId, (err, results) => {
        })

        var query = "insert into notification (notif, checkoutId, orderTime, status) values('just made a new order.',?,now(),'Unread')"
        connection.query(query, results.insertId, (err, results) => {
        })

        if (!err) {
            if (!err) {
                return res.status(200).json(results);
            }
            else {
                return res.status(500).json(err);
            }
        }

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