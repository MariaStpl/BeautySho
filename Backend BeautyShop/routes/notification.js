const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.get('/get',(req, res, next)=>{
    var query = "select n.id, n.notif, n.orderTime, n.checkoutId, n.status as statusNotif, c.id, c.name as name, c.email as email, c.contactNumber, c.paymentMethod, c.address, c.shipping_option, c.status, c.orderTime, c.shipTime, c.completedTime from notification as n INNER JOIN checkout as c ON n.checkoutId = c.id order by n.id DESC";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;