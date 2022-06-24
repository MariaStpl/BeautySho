const express = require('express');
const connection = require("../connection");
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.get('/get', (req, res, next) => {
    var query = "SELECT DISTINCT o.checkoutId as checkoutId, c.id, c.name,c.email,c.contactNumber,c.paymentMethod, c.address, c.shipping_option, o.status, o.orderTime, o.shipTime, o.completedTime FROM orderCart as o INNER JOIN checkout as c ON o.checkoutId = c.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
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

router.patch('/update', (req, res, next) => {
    let checkout = req.body;
    var query = "update orderCart set status=?, completedTime =if(status ='To Completed',now(),completedTime), shipTime =if(status ='To Receive',now(),shipTime) where checkoutId=?"
    //var query = "update checkout set status=? where id=?";
    //var query = "update checkout set status=?, completedTime= CASE WHENE status = 'To Receive' THEN now(), where id=?";
    connection.query(query, [checkout.status, checkout.checkoutId], (err, results) => {
        if (!err) {
            if (!err) {
                if (results.affectedRows == 0) {
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