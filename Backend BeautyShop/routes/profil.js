const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/get/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.params.id);
    var query = "select id, name, email, contactNumber, role, profil_image, status from user where id=?";
    connection.query(query, [id], (err, results) => {
        console.log(results);
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.put('/editProfil', (req, res, next) => {
    var user = req.body;
    var id = user.id;
    var name = user.name;
    var contactNumber = user.contactNumber;

    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_image;
    var img_name = file.name;
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/upload_images/' + file.name, function (err) {
            if (err)
                return res.status(500).send(err);
            var query = "UPDATE user SET name='" + name + "', contactNumber='" + contactNumber + "', profil_image='" + img_name + "' WHERE id='" + id + "'";
            connection.query(query, function (err, resultsUpdate) {
                if (!err) {
                    if (!err) {
                        if (resultsUpdate.affectedRows == 0) {
                            return res.status(404).json({ message: "Profil id does not found" });
                        }
                        return res.status(200).json({ message: "Profil Updated Successfully" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                }
            })
        })
    }
})



module.exports = router;