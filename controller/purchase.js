var conn = require('../connect');
var config = require('../config');
const orderserialgenerate = require('order-id')('Es9rWkwRTESkAVhe');
const receiptserialgenerate = require('order-id')('5aZpNaGD2aRR2hkm');
const orderserial = orderserialgenerate.generate();
const receiptserial = orderserialgenerate.generate();

function checkout (req, res, next) {
    console.log(req.body)
    if(!req.body.delivery_id){
        return res.status(400).send({
            status: 400,
            message: "กรุณาเลือกบริษัทขนส่ง"
        })
    }
    // conn.execute(`SELECT MAX(order_id) as max FROM orders WHERE users_id = ${req.userDataInfo.id}`, (maxerr, maxresult) => {
    //     if(maxerr) throw maxerr

    //     conn.execute(`UPDATE orders SET order_status = 4 WHERE order_status = 3 AND order_id = ${maxresult[0]['max']}`,(updatrestatuspayerr, updatestatuspayresult) => {
    //         if(updatrestatuspayerr) throw updatrestatuspayerr
    //     })
    // })
    conn.execute(`SELECT * FROM cart INNER JOIN product ON cart.product_id = product.secretid WHERE users_id = ${req.userDataInfo.id} AND cart_status = 'pending'`, (selecterror, selectresults) => {
    // conn.execute(`SELECT * FROM cart INNER JOIN product ON cart.product_id = product.secretid WHERE users_id = ${req.userDataInfo.id} AND cart_status = 'pending'`, (selecterror, selectresults) => {
        // console.log(selectresults)
        

        if(selecterror){
            throw(selecterror)
        }

        if(selectresults === undefined || selectresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ผิดพลาด ไม่พบรายการซื้อสินค้าของท่าน"
            })
        }

        var intdata = 0
        var row = 0
        for(var ia = 0; ia < selectresults.length; ia++){
            
            row = selectresults[ia]['product_qty'] - selectresults[ia]['cart_qty']
            if(row < 0){
                intdata++
            }
        }

        if(intdata == 0){
            conn.execute(`INSERT INTO orders (users_id, order_serial, delivery_company_id) VALUES (${req.userDataInfo.id}, '${orderserialgenerate.getTime(orderserial)}', ${req.body.delivery_id})`, (inserterr, inserresults) =>{
                if(inserterr) throw inserterr
                const incart = selectresults
                for(var i = 0;i < selectresults.length; i++){

                    const cartid = selectresults[i]['cart_id']
                    const cartqty = selectresults[i]['cart_qty']
                    const productid = selectresults[i]['product_id']
                    
                    conn.execute(`INSERT INTO orders_details(order_id, product_id, order_qty, product_total_amt, product_prict_unit) VALUES (${inserresults.insertId}, '${incart[i]['product_id']}', ${incart[i]['cart_qty']}, ${incart[i]['cart_qty'] * incart[i]['price']}, ${incart[i]['price']})`, (detailerr, detailresults) => {
                        if(detailerr) throw detailerr
                            
                        conn.execute(`UPDATE cart SET cart_status = 'success' WHERE cart_id = ${cartid}`, (updatestatuserr, updatestatusresults) => {
                            if(updatestatuserr) throw updatestatuserr
                        })

                        conn.execute(`UPDATE product SET product_qty = product_qty - ${cartqty}, sold_qty = sold_qty + ${cartqty} WHERE secretid = ${productid}`, (producterr, productresults) => {
                            if(producterr) throw producterr
                        })

                        // conn.execute(`UPDATE orders a INNER JOIN (SELECT order_id, SUM(product_total_amt) as total FROM orders_details GROUP BY order_id) b ON a.order_id = b.order_id SET a.order_total_amt = b.total WHERE a.order_id = ${inserresults.insertId}`, (orderamterr, orderamtresults) => {
                        //     if(orderamterr) throw orderamterr
                        // })
                    })

                    if(i === 3){
                        continue;
                    }
                }
                
                // res.status(200).send({
                //     status: 200
                // })
                const ordercheckout = {
                    orderid: inserresults.insertId
                }
                req.ordercheckoutid = ordercheckout
                return next();
            })
        }else{
            return res.status(400).send({
                status: 400,
                message: "สินค้าไม่เพียงพอ"
            })
        }

    })
}

function receipt (req, res, next) {
    // console.log(req)
    const orderid = req.ordercheckoutid.orderid

    if(!req.ordercheckoutid){
        res.status(400).send({
            status: 400,
            message: "Error"
        })
    }
    conn.execute(`UPDATE orders a INNER JOIN (SELECT order_id, SUM(product_total_amt) as total FROM orders_details GROUP BY order_id) b ON a.order_id = b.order_id SET a.order_total_amt = b.total WHERE a.order_id = ${orderid}`, (orderamterr, orderamtresults) => {
        if(orderamterr) throw orderamterr

        conn.execute(`UPDATE orders a INNER JOIN (SELECT order_id, SUM(product_total_amt) as total FROM orders_details GROUP BY order_id) b ON a.order_id = b.order_id SET a.order_total_amt = b.total WHERE a.order_id = ${orderid}`, (orderamterr, orderamtresults) => {
            if(orderamterr) throw orderamterr
    
            conn.execute(`SELECT * FROM orders a INNER JOIN orders_details b ON a.order_id = b.order_id INNER JOIN product c ON b.product_id = c.secretid INNER JOIN users d ON a.users_id = d.id WHERE a.users_id = ${req.userDataInfo.id} AND a.order_id = ${orderid}`, (recerr, recresults) => {
                if(recerr) throw recerr
                conn.execute(`INSERT INTO receipt(users_id, user_address, order_id, order_serial, receipt_toal_amt, user_name, receipt_serial) VALUE (${recresults[0]['users_id']}, '${recresults[0]['addr']}', ${recresults[0]['order_id']}, '${recresults[0]['order_serial']}', ${recresults[0]['order_total_amt']}, '${recresults[0]['fname']} ${recresults[0]['lname']}', '${receiptserialgenerate.getTime(receiptserial)}')`, (insrecerr, insrecresults) => {
                    if(insrecerr) throw insrecerr
                    conn.execute(`SELECT * FROM orders_details a INNER JOIN product b ON a.product_id = b.secretid WHERE order_id = ${orderid}`, (detailerr, detailresults)=>{
                        if(detailerr) throw detailerr
                        const orderdetail = detailresults
                        for(var i = 0;i < orderdetail.length; i++){
                            conn.execute(`INSERT INTO receipt_detail(receipt_id, receipt_qty, product_id, product_name, product_unit_price, product_code, product_total_amt) VALUE (${insrecresults.insertId}, ${orderdetail[i]['order_qty']}, ${orderdetail[i]['product_id']}, '${orderdetail[i]['name']}', ${orderdetail[i]['price']}, '${orderdetail[i]['id']}', ${orderdetail[i]['product_total_amt']})`, (recdetailerr, recdetailresults) => {
                                if(recdetailerr) throw recdetailerr
                            })

                            if(i === 3){
                                continue;
                            }
                        }
                        return res.status(200).send({
                            status: 200
                        })
                    })
                })
            })
        })
    })
}

function listcheckout (req, res) {
    var orderdetail = []
    conn.execute(`SELECT * FROM receipt WHERE receipt_status = 1 AND users_id = ${req.userDataInfo.id} ORDER BY receipt_id DESC LIMIT 1`, (recerr, recresults) => {
        if (recerr) throw recerr
        if(recresults == undefined || recresults.length == 0 ){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบใบเสร็จ"
            })
        }

        conn.execute(`SELECT * FROM receipt_detail a INNER JOIN product b ON a.product_id = b.secretid WHERE a.receipt_id = ${recresults[0]['receipt_id']}`, (recdetailerr, reddetailresults) => {
            if(recdetailerr) throw recdetailerr

            if(reddetailresults == undefined || reddetailresults.length == 0 ){
                return res.status(400).send({
                    status: 400,
                    message: "ไม่พบรายละเอียดใบเสร็จ"
                })
            }

            for(var i=0;i <reddetailresults.length; i++){
                orderdetail.push({
                    id: reddetailresults[i]['id'],
                    name: reddetailresults[i]['name'],
                    image: config.mainUrl + config.imagePath + reddetailresults[i]['image'],
                    productunitprice: reddetailresults[i]['product_prict_unit'],
                    qty:  reddetailresults[i]['order_qty'],
                    totalamt: reddetailresults[i]['product_total_amt'],
                })
            }

            res.status(200).send({
                status: 200,
                order:{
                    receiptid: recresults[0]['receipt_id'],
                    receiptserial: recresults[0]['receipt_serial'],
                    receiptotalamt: recresults[0]['receipt_toal_amt'],
                    orderid: recresults[0]['order_id'],
                    orderserial: recresults[0]['order_serial'],
                },
                orderdetail
            })
        })
    })
}

function payment(req, res) {
    if(!req.body && !req.files || !req.body.receiptid){
        return res.status(400).send({
            status: 400
        })
    }
    
    conn.execute(`SELECT * FROM receipt WHERE receipt_id = ${req.body.receiptid}`, (selrecerr, selrecresults) => {
        if(selrecerr) throw selrecerr
        if(selrecresults === undefined || selrecresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "เกิดข้อผิดพลาด"
            })
        }
        if(req.files){
            var file = req.files.image
            var fileanmemd5 = file.md5
            var type = file.mimetype
            var cuttype = type.split('/')
            var filename = fileanmemd5 + "." + cuttype[1]

            file.mv('./store/receipt/payment/'+ fileanmemd5 + "." + cuttype[1], function(err){
                if(err){res.send(err)}
                else{
                    conn.execute(`INSERT INTO payment(payment_image, payment_price, payment_time, receipt_id) VALUE ('${filename}', ${req.body.price}, '${req.body.time}', ${selrecresults[0]['receipt_id']})`, (payerr, payresults) => {
                        if(payerr) throw payerr
                        conn.execute(`UPDATE receipt SET receipt_status = 2 WHERE receipt_status = 1 AND receipt_id = ${selrecresults[0]['receipt_id']}`, (ureceipterr, ureceiptresults) => {
                            if(ureceipterr) throw ureceipterr
                            return res.status(200).send({
                                status: 200,
                                message: "ชำระเงินสำเร็จ"
                            })
                        })
                    })
                }
            })
        }
    })
}

module.exports = {
    checkout,
    listcheckout,
    receipt,
    payment
}