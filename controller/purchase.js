var conn = require('../connect');
var config = require('../config');

async function clearcheckoutfn (req, res, next) {
    conn.execute(`UPDATE orders SET order_status = 4 WHERE order_status = 3 AND users_id = ${req.userDataInfo.id}`,(updatrestatuspayerr, updatestatuspayresult) => {
        if(updatrestatuspayerr) throw updatrestatuspayerr
    })
    next();
}

const checkout = (req, res) => {
    // conn.execute(`SELECT MAX(order_id) as max FROM orders WHERE users_id = ${req.userDataInfo.id}`, (maxerr, maxresult) => {
    //     if(maxerr) throw maxerr

    //     conn.execute(`UPDATE orders SET order_status = 4 WHERE order_status = 3 AND order_id = ${maxresult[0]['max']}`,(updatrestatuspayerr, updatestatuspayresult) => {
    //         if(updatrestatuspayerr) throw updatrestatuspayerr
    //     })
    // })
    conn.execute(`SELECT * FROM cart LEFT JOIN product ON cart.product_id = product.secretid WHERE users_id = ${req.userDataInfo.id} AND cart_status = 'pending'`, (selecterror, selectresults) => {
        // console.log(selectresults)
        if(selecterror){
            throw(selecterror)
        }

        if(selectresults === undefined || selectresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ผิดพลาด"
            })
        }
        // conn.execute(`UPDATE orders SET order_status = 4 WHERE order_status = 3 AND users_id = ${req.userDataInfo.id}`,(updatrestatuspayerr, updatestatuspayresult) => {
        //     if(updatrestatuspayerr) throw updatrestatuspayerr
        // })

        conn.execute(`INSERT INTO orders (users_id, order_serial) VALUES (${req.userDataInfo.id}, 'serial')`, (inserterr, inserresults) =>{
            if(inserterr) throw inserterr
            const incart = selectresults
            for(var i = 0;i < selectresults.length; i++){
                const cartid = selectresults[i]['cart_id']
                const cartqty = selectresults[i]['cart_qty']
                const productid = selectresults[i]['product_id']
                conn.execute(`INSERT INTO orders_details(order_id, product_id, order_qty, product_total_amt, product_prict_unit) VALUES (${inserresults.insertId}, '${incart[i]['product_id']}', ${incart[i]['cart_qty']}, ${incart[i]['cart_qty'] * incart[i]['price']}, ${incart[i]['price']})`, (detailerr, detailresults) => {
                    if(detailerr) throw detailerr
                        
                    // conn.execute(`UPDATE cart SET cart_status = 'success' WHERE cart_id = ${cartid}`, (updatestatuserr, updatestatusresults) => {
                    //     if(updatestatuserr) throw updatestatuserr
                    // })

                    conn.execute(`UPDATE product SET product_qty = product_qty - ${cartqty}, sold_qty = sold_qty + ${cartqty} WHERE secretid = ${productid}`, (producterr, productresults) => {
                        if(producterr) throw producterr
                    })

                    conn.execute(`UPDATE orders a INNER JOIN (SELECT order_id, SUM(product_total_amt) as total FROM orders_details GROUP BY order_id) b ON a.order_id = b.order_id SET a.order_total_amt = b.total WHERE a.order_id = ${inserresults.insertId}`, (orderamterr, orderamtresults) => {
                        if(orderamterr) throw orderamterr
                    })
                })
            }
            return res.status(200).send({
                status: 200
            })
        })
    })
}

const betacheckout = (req, res) => {
    conn.execute(`SELECT * FROM cart LEFT JOIN product ON cart.product_id = product.secretid WHERE users_id = ${req.userDataInfo.id} AND cart_status = 'pending'`, (selecterror, selectresults) => {
        if(selecterror) throw (selecterror)
        if(selectresults === undefined || selectresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ผิดพลาด"
            })
        }
        conn.execute(`INSERT INTO orders (users_id, order_serial) VALUES (${req.userDataInfo.id}, 'serial')`, (inserterr, inserresults) =>{
            if(inserterr) throw inserterr
            const incart = selectresults
            incart.forEach(element => {
                conn.execute(`INSERT INTO orders_details(order_id, product_id, order_qty, product_total_amt, product_prict_unit) VALUES (${inserresults.insertId}, '${element.product_id}', ${element.cart_qty}, ${element.cart_qty * element.price}, ${element.price})`, (detailerr, detailresults) => {
                    if(detailerr) throw detailerr
                    conn.execute(`SELECT order_id, sum(product_total_amt) as total FROM orders_details WHERE order_id = ${inserresults.insertId} GROUP BY order_id`, (selectsumamterr, selectsumamtresults) => {
                        if(selectsumamterr) throw selectsumamterr
                        conn.execute(`UPDATE orders SET order_total_amt = ${selectsumamtresults[0]['total']} WHERE order_id = ${inserresults.insertId}`,(updateoederserr, updateorderresults) => {
                            if(updateoederserr) throw updateoederserr
                            console.log(updateorderresults)

                        })
                    })
                })
            })
        })
    })
}

const listcheckout = (req, res) => {
    // console.log(req.userDataInfo)
    var objs = []
    conn.execute(`SELECT * FROM orders a INNER JOIN orders_details b ON a.order_id = b.order_id INNER JOIN product c ON b.product_id = c.secretid WHERE a.order_status = 2 AND a.users_id = ${req.userDataInfo.id} ORDER BY a.order_id DESC LIMIT 1`, (carterr, cartresults) => {
        if(carterr) throw carterr 

        if(cartresults === undefined || cartresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ผิดพลาด"
            })
        }
        
        for(var i=0;i <cartresults.length; i++){
            objs.push({
                id: cartresults[i]['order_id'],
                serial: cartresults[i]['order_serial'],
                order_total_amt: cartresults[i]['order_total_amt'],
                product_total_amt: cartresults[i]['product_total_amt'],
                order_qty: cartresults[i]['order_qty'],
                product_name: cartresults[i]['name'],
                product_price: cartresults[i]['price'],
                product_image: config.mainUrl + config.imagePath + cartresults[i]['image'],
            })
        }
        res.status(200).send({
            status: 200,
            order: objs
        })
    })
}

module.exports = {
    clearcheckoutfn,
    checkout,
    listcheckout
}