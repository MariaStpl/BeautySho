const express = require('express');
const connection = require('../connection');
const router = express.Router();


router.post('/add', (req, res) => {
    let cart = req.body;
    var query = "INSERT INTO cart (itemId, productId, quantity, itemPrice, total, createDate, updateDate) VALUES (?,?,1,?,itemPrice*quantity,now(), now()) ON DUPLICATE KEY UPDATE quantity=(quantity)+1,updateDate=VALUES(updateDate),total=itemPrice*quantity";
    //var query = "INSERT INTO cart (itemId, productId, quantity, total, createDate, updateDate) VALUES (?,?,?,?,now(), now()) ON DUPLICATE itemId UPDATE quantity = ?, total = ?, updateDate = now()";
    //var query = "insert into cart (itemId, productId, quantity, total, createDate) values(?,?,?,?, now())";
    connection.query(query, [cart.itemId, cart.productId, cart.itemPrice], (err, result) => {
        if (!err) {
            return res.status(200).json({ message: "product Added Successfully" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.get('/getTotal', (req, res, next) => {
    var totalSum;
    var query = "SELECT SUM(total) as totalSum FROM cart";
    connection.query(query, (err, results) => {
        if (!err) {
            totalSum = results[0].totalSum;
            var data ={
                sumVal : totalSum,
            };
            return res.status(200).json(data);
        }
        else {
            return res.status(500).json(err);
        }
    })
})



router.get('/get', (req, res, next) => {
    var query = "SELECT cart.id, cart.itemId, cart.productId, cart.quantity, cart.total, cart.createDate, detail_product.id as itemId, detail_product.item as itemSize, detail_product.description as itemDesc, detail_product.price as itemPrice, detail_product.image as itemImage, product.name as productName, product.id as productId FROM cart, detail_product, product WHERE cart.itemId=detail_product.id AND detail_product.productId = product.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    var query = "delete from cart where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product id does not found" });
            }
            return res.status(200).json({ message: "Product Deleted Successfully" });
        }
        else {
            return res.status(500).json(err);
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

router.patch('/update', (req, res, next) => {
    let cart = req.body;
    var query = "update cart set quantity=?, updateDate=now(), total=itemPrice*quantity where id=?";
    connection.query(query, [cart.quantity, cart.id], (err, results) => {
        if (!err) {
            if (!err) {
                if (results.affectedRows == 0) {
                    return res.status(404).json({ message: "Product id does not found" });
                }
                return res.status(200).json({ message: "Product Updated Successfully" });
            }
            else {
                return res.status(500).json(err);
            }
        }
    })
})




module.exports = router;
