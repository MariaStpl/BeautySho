const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/addProductsDetails', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var detail_product = req.body;
    var proId = detail_product.productId;
    var item = detail_product.item;
    var desc = detail_product.description;
    var price = detail_product.price;
    if (!req.files)

        return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_image;
    var img_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/upload_detail/' + file.name, function (err) {

            if (err)
                return res.status(500).send(err);
            var sql = "INSERT INTO `detail_product`(`productId`,`item`,`description`,`price`, `image`) VALUES ('" + proId + "','" + item + "','" + desc + "','" + price + "','" + img_name + "')";
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

router.get('/getProductsItem/:id', (req, res, next) => {
    const id = req.params.id;
    var query = "select detail_product.id as itemId, detail_product.item, detail_product.description, detail_product.price as itemPrice, detail_product.image, detail_product.status, product.id as productId, product.name as productName, product.image as productImage from detail_product INNER JOIN product ON detail_product.productId = product.id WHERE detail_product.productId=?";
    //var query = "select p.id, p.name, p.description, p.image, d.id as detailId, d.item as detailItem, d.image as detailImage, d.price as detailPrice, d.description as detailescription from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// router.get('/getProductsItem/:opsi', (req, res, next) => {
//     const opsi = req.params.opsi;
//     var query = "select d.id, d.item, d.description, d.price, d.image, d.status, p.id as productId, p.name as productName, p.image as productImage from detail_product as d INNER JOIN product as p where d.productId = p.id";
//     //var query = "select p.id, p.name, p.description, p.image, d.id as detailId, d.item as detailItem, d.image as detailImage, d.price as detailPrice, d.description as detailescription from product as p INNER JOIN category as c where p.categoryId = c.id";
//     connection.query(query, [opsi], (err, results) => {
//         if (!err) {
//             return res.status(200).json(results);
//         }
//         else {
//             return res.status(500).json(err);
//         }
//     })
// })

router.get('/getProductsDetails', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    var query = "select d.id, d.item, d.description, d.price as itemPrice, d.image, d.status, p.id as productId, p.name as productName, p.image as productImage from detail_product as d INNER JOIN product as p where d.productId = p.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.get('/getByProduct/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id, item from detail_product where productId =? and status= 'true'";
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
    var query = "select id, item, price from detail_product where id = ?";
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
    var detail_product = req.body;
    var id = detail_product.id;
    var proId = detail_product.productId;
    var item = detail_product.item;
    var desc = detail_product.description;
    var price = detail_product.price;
    console.log(req)
    if (!req.files)

        return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_image;
    var img_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/upload_detail/' + file.name, function (err) {
            if (err)
                return res.status(500).send(err);
            var sql = "UPDATE detail_product SET item='" + item + "', productId='" + proId + "', description='" + desc + "', price='" + price + "', image='" + img_name + "' WHERE id='" + id + "'";
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
    var query = "delete from detail_product where id=?";
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
    var query = "update detail_product set status=? where id=?";
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
