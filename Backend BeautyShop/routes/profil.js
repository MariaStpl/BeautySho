const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/get/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.params.id);
    var query = "select id, name, email, contactNumber, status from user where id=?";
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


module.exports = router;