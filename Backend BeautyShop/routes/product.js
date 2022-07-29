const express = require('express');
const { route } = require('..');
const connection = require('../connection');
const router = express.Router();
const multer = require('multer');
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var product = req.body;
    var name = product.name;
    var catId = product.categoryId;
    var desc = product.description;
    var price = product.price;
    console.log(req)
    if (!req.files)

        return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_image;
    var img_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/upload_images/' + file.name, function (err) {

            if (err)
                return res.status(500).send(err);
            var sql = "INSERT INTO `product`(`name`,`categoryId`,`description`,`price`, `image`) VALUES ('" + name + "','" + catId + "','" + desc + "','" + price + "','" + img_name + "')";
            var query = connection.query(sql, function (err, result) {
                if(!err){
                    return res.status(200).json({message:"product Added Successfully"})
                }
                else{
                    return res.status(500).json(err);
                }
                
            });
        });

    }
    else {
        return res.status(500).json(err);
    }
});


router.get('/get', auth.authenticateToken, (req, res, next) => {
    //var query = "select *from product"
    //var query = "SELECT name,description,price, image FROM product INNER JOIN category ON categoryId=categoryName";
    var query = "select p.id, p.name, p.description, p.price, p.image, p.status, c.id as categoryId, c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, (err, results) => {
        if (!err) {
            console.log(results);
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getProductsHome', (req, res, next) => {
    var query = "select p.id, p.name, p.description, p.price, p.image, p.status, c.id as categoryId, c.name as categoryName, c.icon as categoryIcon from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id, name from product where categoryId =? and status= 'true'";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id, name, description, price from product where id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.put('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    var product = req.body;
    var id = product.id;
    var name = product.name;
    var catId = product.categoryId;
    var desc = product.description;
    var price = product.price;
    
    if (!req.files)

        return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_image;
    var img_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/upload_images/' + file.name, function (err) {
            if (err)
                return res.status(500).send(err);
            var sql = "UPDATE product SET name='" + name + "', categoryId='" + catId + "', description='" + desc + "', price='" + price + "', image='" + img_name + "' WHERE id='" + id + "'";
            //var sql = "update product set name=?, categoryId=?, description=?, price=?, img_name=? where id=?";
            var query = connection.query(sql, function (err, results) {
                if (!err) {
                    if (results.affectedRows == 0) {
                        return res.status(404).json({ message: "Product id does not found" });
                    }
                    return res.status(200).json({ message: "Product Updated Successfully" });
                }
                else {
                    return res.status(500).json(err);
                }
                
            });
        });

    }
    else {
        return res.status(500).json(err);
    }
});

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from product where id=?";
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

router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product id does not found" });
            }
            return res.status(200).json({ message: "Product status Updated Successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;