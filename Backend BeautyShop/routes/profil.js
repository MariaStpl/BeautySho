const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/get', (req, res) => {
    var query = "select id, name, email, contactNumber, status from user";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;