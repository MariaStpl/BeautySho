const express = require('express');
const connection = require('../connection');
const router = express.Router();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/signupAdmin', async (req, res) => {
    let user = req.body;
    var values = user.password;
    const salt = await bcrypt.genSalt(10);
    var value = await bcrypt.hash(values,salt)
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name, contactNumber, email, password, status, role) values(?,?,?,?,'true','admin')"
                connection.query(query, [user.name, user.contactNumber, user.email, value], (err, results) => {
                    if (!err) {
                        return res.status(200).json(results)
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ message: "Email Already Exist." });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.post('/signup', async (req, res) => {
    let user = req.body;
    var values = user.password;
    const salt = await bcrypt.genSalt(10);
    var value = await bcrypt.hash(values,salt)
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name, contactNumber, email, password, status, role) values(?,?,?,?,'false','user')"
                connection.query(query, [user.name, user.contactNumber, user.email, value], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully Registered" })
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ message: "Email Already Exist." });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.post('/login', (req, res) => {
    const user = req.body;
    query = "select id, email, password, contactNumber, role, status from user where email=?";
    connection.query(query, [user.email], async (err, results) => {
        lovley = await bcrypt.compare(user.password, results[0].password);
        if (!err) {
            if (results.length <= 0 || lovley === false) {
                return res.status(401).json({ message: "Incorect Username or Password" });
            } else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Wait for Admin Approval" });
            } else if (lovley === true) {
                const response = { id:results[0].id, email: results[0].email, contactNumber: results[0].contactNumber, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken, id:results[0].id, email: results[0].email, contactNumber: results[0].contactNumber, role: results[0].role});
            } else {
                return res.status(400).json({ message: "Something went wrong. Please try again later" });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword', async (req, res) => {
    const user = req.body;
    var c = Math.round(100 + (Math.random() * 99999));
    var numberOrder = c.toString()
    queryUpdate = "update user set reset_token = ? where email= ?";
    connection.query(queryUpdate, [numberOrder, user.email], (err, resultsUpdate) => {
    })   
    querySelect = "Select email, reset_token from user where email=?";
        connection.query(querySelect, await [user.email], (err, resultsSelect) => {    
        if (!err) {
            if (resultsSelect.length <= 0) {
                return res.status(200).json({ message: "Password sent succesfully to your email." });
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: resultsSelect[0].email,
                    subject: 'Reset your password',
                    html: '<p>Recently you requested to reset your Beauty Shop Account.<br>' + '<b>Email: </b>'+resultsSelect[0].email + '<br><b>Token: </b>'+ resultsSelect[0].reset_token + '<br>Click the button below and follow the reset instructions.<br><br>'+'<a href="http://localhost:4200/user/resetPassword"><input type=button style="background: linear-gradient(to bottom right, #EF4765, #FF9A5A); color:white; border-radius: 4px; border:none; padding:7px" value="Reset Password"></a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({ message: "Password sent succesfully to your email." });
            }
        } else {
            return res.status(500).json(err);
        }
    }) 
   
    
})



router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id, name, email, contactNumber, status from user where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/resetPassword', async (req, res) => {
    let user = req.body;
    var values = user.password;
    const salt = await bcrypt.genSalt(10);
    var value = await bcrypt.hash(values,salt)
    var query = "update user set password=? where reset_token=?";
    connection.query(query, [value, user.reset_token], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "User token does not exist" });
            }
            return res.status(200).json({ message: "User create new password Successfuly" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "User id does not exist" });
            }
            return res.status(200).json({ message: "User Updated Successfuly" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json(res.locals);
})

router.post('/changePassword', auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    console.log(email);
    var query = "select *from user where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect Old Password" });
            }
            else if (results[0].password == user.oldPassword) {
                query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password Update Successfully" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Something went wrong. Please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;