const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var category = req.body;
    var name = category.name;

    console.log(req)
    if (!req.files)

        return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_icon;
    var icon_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/upload_icons/' + file.name, function (err) {

            if (err)
                return res.status(500).send(err);
            var sql = "INSERT INTO `category`(`name`,`icon`) VALUES ('" + name + "','" + icon_name + "')";
            var query = connection.query(sql, function (err, result) {
                if (!err) {
                    return res.status(200).json({ message: "Category Added Successfully" })
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

router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "select *from category order by name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})



router.put('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    var category = req.body;
    var id = category.id;
    var name = category.name;


    if (!req.files)

        return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_icon;
    var icon_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/upload_icons/' + file.name, function (err) {

            if (err)
                return res.status(500).send(err);
            var sql = "UPDATE category SET name='" + name + "', icon='" + icon_name + "' WHERE id='" + id + "'";
            var query = connection.query(sql, function (err, results) {
                if (!err) {
                    if (results.affectedRows == 0) {
                        return res.status(404).json({ message: "Category id does not found" });
                    }
                    return res.status(200).json({ message: "Category Updated Successfully" });
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
})

module.exports = router;