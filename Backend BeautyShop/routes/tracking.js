const express = require('express');
const { localeData } = require('moment');
const { response } = require('..');
const connection = require("../connection");
const router = express.Router();

router.get('/get/:receipt', (req, res, next) => {
    const receipt = req.params.receipt;
    var query = "SELECT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option, status, orderTime, confirmTime, shipTime, completedTime, receipt from checkout WHERE receipt=?";
    connection.query(query, [receipt], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;