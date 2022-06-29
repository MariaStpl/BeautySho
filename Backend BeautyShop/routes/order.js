const express = require('express');
const connection = require('../connection');
const router = express.Router();


// router.get('/get', (req, res, next) => {
//     var order = [];
//     var fullOrder = []
//     var queryCheckout = "SELECT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option from checkout";
//     connection.query(queryCheckout, (err, resultsCheckout) => {
//         for (const order of resultsCheckout (v => Object.assign({}, v)))
//         console.log("order"); console.log(order);

//     });

//     fullOrder = order.map((mapOrder) => {
//         var queryitems = "SELECT o.id, o.itemId, o.productId, o.quantity, o.total, o.checkoutId, d.id as itemId, d.item as itemSize, d.description as itemDesc, d.image as itemImage, p.name as productName, p.id as productId FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id)INNER JOIN product as p ON d.productId = p.id) where o.checkoutId = ?"
//         connection.query(queryitems, mapOrder.checkoutId, (err, resultsOrder) => {
//             mapOrder.items = resultsOrder.map(v => Object.assign({}, v));
//             console.log("checkout");
//             console.log(mapOrder);
//             return mapOrder

//         })

//         console.log("full_order"); console.log(fullOrder);
//         if (!err) {
//             return res.status(200).json(fullOrder);
//         }
//         else {
//             return res.status(500).json(err);
//         }



//     });

// })


// router.get('/get', (req, res, next) => {
//     var query = "WITH items AS (SELECT o.id, o.itemId, o.productId, o.quantity, o.total, o.checkoutId, d.id as itemId, d.item as itemSize, d.description as itemDesc, d.image as itemImage, p.name as productName, p.id as productId FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id)INNER JOIN product as p ON d.productId = p.id) WHERE o.checkoutId = ? )SELECT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option from checkout";
//     items = req.query;
//     connection.query(query, [items.checkoutId], (err, results) => {
//         if (!err) {
//             return res.status(200).json(results);
//         }
//         else {
//             return res.status(500).json(err);
//         }
//     })
// })

router.get('/get/:id', (req, res, next) => {
    var order = [] ;var fullOrder = []
    const id = req.params.id;
    console.log(req.params.id);
    var queryCheckout = "SELECT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option, status, orderTime, shipTime, completedTime from checkout WHERE id=?  order by id DESC";
    connection.query(queryCheckout, [id], (err, resultsCheckout) => {
        
        if (resultsCheckout) {
            order = resultsCheckout.map(v => Object.assign({}, v))

            fullOrder =  order.map(( mapOrder) => {
                var queryitems = "SELECT o.id, o.itemId, o.productId, o.quantity, o.total, o.checkoutId, d.id as itemId, d.item as itemSize,  d.price as itemPrice, d.description as itemDesc, d.image as itemImage, p.name as productName, p.id as productId FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id)INNER JOIN product as p ON d.productId = p.id) where o.checkoutId = ?"
                connection.query(queryitems, mapOrder.checkoutId, (err, resultsOrder) => {
                    mapOrder.items = resultsOrder.map( v => Object.assign({}, v));

                })
                return mapOrder
            });

        }
        setTimeout(() => {
            if (!err) {
                return res.status(200).json(fullOrder);
            }
            else {
                return res.status(500).json(err);
            }

        }, 2000);
    })
})

router.get('/getAll/', (req, res, next) => {
    var order = [] ;var fullOrder = []
    var queryCheckout = "SELECT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option, status, orderTime, shipTime, completedTime from checkout order by id DESC";
    connection.query(queryCheckout, (err, resultsCheckout) => {
        
        if (resultsCheckout) {
            order = resultsCheckout.map(v => Object.assign({}, v))

            fullOrder =  order.map(( mapOrder) => {
                var queryitems = "SELECT o.id, o.itemId, o.productId, o.quantity, o.total, o.checkoutId, d.id as itemId, d.item as itemSize,  d.price as itemPrice, d.description as itemDesc, d.image as itemImage, p.name as productName, p.id as productId FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id)INNER JOIN product as p ON d.productId = p.id) where o.checkoutId = ?"
                connection.query(queryitems, mapOrder.checkoutId, (err, resultsOrder) => {
                    mapOrder.items = resultsOrder.map( v => Object.assign({}, v));

                })
                return mapOrder
            });

        }
        setTimeout(() => {
            if (!err) {
                return res.status(200).json(fullOrder);
            }
            else {
                return res.status(500).json(err);
            }

        }, 2000);
    })
})

// router.get('/getTotal', (req, res, next) => {
//     var totalSum;
//     var query = "SELECT SUM(total) as totalSum FROM orderCart";
//     connection.query(query, (err, results) => {
//         if (!err) {
//             totalSum = results[0].totalSum;
//             var data ={
//                 sumVal : totalSum,
//             };
//             return res.status(200).json(data);
//         }
//         else {
//             return res.status(500).json(err);
//         }
//     })
// })



// router.get('/get', async (req, res, next) => {
//     var order = [] ;var fullOrder = []
//     var queryCheckout = "SELECT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option from checkout";
//     await connection.query(queryCheckout, (err, resultsCheckout) => {
//         if (resultsCheckout) {
//             for (const order of resultsCheckout)
//             console.log("order"); console.log(order);
//             for (const mapOrder of order)  {
//                 var queryitems = "SELECT o.id, o.itemId, o.productId, o.quantity, o.total, o.checkoutId, d.id as itemId, d.item as itemSize, d.description as itemDesc, d.image as itemImage, p.name as productName, p.id as productId FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id)INNER JOIN product as p ON d.productId = p.id) where o.checkoutId = ?"
//                 await connection.query(queryitems, order.checkoutId, (err, resultsOrder) => {
//                     checkout = mapOrder.items
//                     for (const checkout of resultsOrder)
//                     console.log("checkout");
//                     console.log(checkout);
//                 })
//                 return checkout
//             };
//             console.log("full_order"); console.log(mapOrder);
//         }
//         if (!err) {
//             return res.status(200).json(mapOrder);
//         }
//         else {
//             return res.status(500).json(err);
//         }

//     })
// })



// router.get('/get', async (req, res, next) => {
//     var order = [] ;var fullOrder = []
//     var queryCheckout = "SELECT id as checkoutId, name, email, contactNumber, paymentMethod, address, shipping_option from checkout";
//     await connection.query(queryCheckout, (err, resultsCheckout) => {
//         if (resultsCheckout) {
//             for (let i = 0; i < resultsCheckout.length; i++) {
//                 order = resultsCheckout
//                 for (let i = 0; i < order.length; i++) {
//                     var queryitems = "SELECT o.id, o.itemId, o.productId, o.quantity, o.total, o.checkoutId, d.id as itemId, d.item as itemSize, d.description as itemDesc, d.image as itemImage, p.name as productName, p.id as productId FROM ((orderCart as o INNER JOIN detail_product as d ON o.itemId = d.id)INNER JOIN product as p ON d.productId = p.id) where o.checkoutId = ?"
//                     items = order
//                     connection.query(queryitems, mapOrder.checkoutId, (err, resultsOrder) => {
//                         for (let i = 0; i < items.length; i++) {
//                             items = mapOrder
//                         console.log("checkout");
//                         console.log(mapOrder);
//                 }})
//                     return mapOrder
//                 };
//                 console.log("full_order"); console.log(fullOrder);
//             }
//         }
//         if (!err) {
//             return res.status(200).json(fullOrder);
//         }
//         else {
//             return res.status(500).json(err);
//         }

//     })
// })

//Object.entries(items).forEach(([key,value]) => {order[key] = value })
//var query = "SELECT orderCart.id, orderCart.itemId, orderCart.productId, orderCart.quantity, orderCart.total, orderCart.checkoutId, detail_product.id as itemId, detail_product.item as itemSize, detail_product.description as itemDesc, detail_product.image as itemImage, product.name as productName, product.id as productId, checkout.id as checkoutId, checkout.name, checkout.email, checkout.contactNumber, checkout.paymentMethod, checkout.address, checkout.shipping_option FROM orderCart, detail_product, product, checkout WHERE orderCart.itemId=detail_product.id AND detail_product.productId = product.id AND orderCart.checkoutId = checkout.id";
//var query = "select c.id, c.name,c.email, c.contactNumber, c.paymentMethod, c.address, c.shipping_option, GROUP_CONCAT(concat(o.itemId,'|',o.productId,'|',o.quantity,'|',o.total,'|',o.checkoutId,'|', d.item,'|', d.price,'|', d.image,'|', p.name)) from checkout as c INNER JOIN (orderCart as o INNER JOIN (detail_product as d INNER JOIN product as p ON d.productId = p.id) ON o.itemId = d.id) ON o.checkoutId = c.id GROUP BY c.id"
//var query = "select checkout.id, checkout.name,checkout.email, checkout.contactNumber, checkout.paymentMethod, checkout.address (orderCart.itemId,orderCart.productId,orderCart.quantity,orderCart.total,orderCart.checkoutId, detail_product.item, detail_product.price, detail_product.image, product.name) from checkout INNER JOIN (orderCart INNER JOIN (detail_product INNER JOIN product ON detail_product.productId = product.id) ON orderCart.itemId = detail_product.id) ON orderCart.checkoutId = checkout.id GROUP BY checkout.id"
//var query = "SELECT id, itemId, productId FROM orderCart ORDER BY checkoutId"

module.exports = router;
