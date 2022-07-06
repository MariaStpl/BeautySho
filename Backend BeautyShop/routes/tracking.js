const express = require('express');
const { localeData } = require('moment');
const { response } = require('..');
const connection = require("../connection");
const router = express.Router();

router.get('/get/:receipt', (req, res, next) => {
    const receipt = req.params.receipt;
    var order = []; var fullOrder = []
    var queryCheckout = "SELECT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option, status, orderTime, confirmTime, shipTime, completedTime, receipt, keterangan from checkout WHERE receipt = ?";
    connection.query(queryCheckout, [receipt], (err, resultsCheckout) => {
        if (resultsCheckout) {
            history = resultsCheckout.map(v => Object.assign({}, v))
            fullOrder = history.map((mapHis) => {
                var queryhist = "SELECT keterangan, createDate from history where checkoutId = ?"
                connection.query(queryhist, mapHis.checkoutId, (err, resultsHist) => {
                    mapHis.hist = resultsHist.map(v => Object.assign({}, v));
                    history.map((mapOrder) => {
                        var queryitems = "SELECT o.id, o.itemId, o.productId, o.quantity, o.total, o.checkoutId, d.id as itemId, d.item as itemSize, d.image as itemImage, d.price as itemPrice, d.description as itemDesc, p.name as productName, p.id as productId FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id)INNER JOIN product as p ON d.productId = p.id) where o.checkoutId = ?"
                        connection.query(queryitems, mapOrder.checkoutId, (err, resultsOrder) => {
                            mapOrder.items = resultsOrder.map(v => Object.assign({}, v));

                        })
                        return mapOrder
                    })
                })
                return mapHis
            })
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


module.exports = router;