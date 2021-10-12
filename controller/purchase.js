var conn = require('../connect');
var config = require('../config');

const checkout = (req, res) => {
    conn.execute(`SELECT * FROM cart LEFT JOIN product ON cart.product_id = product.secretid WHERE users_id = ${req.userDataInfo.id} AND cart_status = 'pending'`, (selecterror, selectresults) => {
        if(selecterror){
            throw(selecterror)
        }
        conn.execute(`INSERT INTO orders (users_id, order_serial) VALUES (${req.userDataInfo.id}, 'serial')`, (inserterr, inserresults) =>{
            if(inserterr) throw inserterr
            const incart = selectresults
            incart.forEach(element => {
                console.log(element)
                conn.execute(`INSERT INTO orders_details(order_id, product_id, order_qty, product_total_amt, product_prict_unit) VALUES (${inserresults.insertId}, '${element.product_id}', ${element.cart_qty}, ${element.cart_qty * element.price}, ${element.price})`, (detailerr, detailresults) => {
                    if(detailerr) throw detailerr
                    conn.execute(`UPDATE orders a INNER JOIN (SELECT order_id, SUM(product_total_amt) as total FROM orders_details GROUP BY order_id) b ON a.order_id = b.order_id SET a.order_total_amt = b.total WHERE a.order_id = ${inserresults.insertId}`, (orderamterr, orderamtresults) => {
                        if(orderamterr) throw orderamterr
                        conn.execute(`UPDATE cart SET cart_status = 'success' WHERE cart_id = ${element.cart_id}`, (updatestatuserr, updatestatusresults) => {
                            if(updatestatuserr) throw updatestatuserr
                        })
                    })
                    conn.execute(`UPDATE product SET product_qty = product_qty - ${element.cart_qty}, sold_qty = sold_qty + ${element.cart_qty} WHERE id = '${element.product_id}'`, (producterr, productresults) => {
                        if(producterr) throw producterr
                    })
                    res.send({
                        status: 200
                    })
                })
            })
        })
    })
}

const listcheckout = (req, res) => {
    // console.log(req.userDataInfo)
    var objs = []
    conn.execute(`SELECT * FROM orders a INNER JOIN orders_details b ON a.order_id = b.order_id INNER JOIN product c ON b.product_id = c.secretid WHERE a.order_status = 'waitingpayment' AND a.users_id = ${req.userDataInfo.id} ORDER BY a.order_id DESC`, (carterr, cartresults) => {
        if(carterr) throw carterr 
        
        for(var i=0;i <cartresults.length; i++){
            objs.push({
                id: cartresults[i]['order_id'],
                serial: cartresults[i]['order_serial'],
                order_total_amt: cartresults[i]['order_total_amt'],
                order_qty: cartresults[i]['order_qty'],
                product_name: cartresults[i]['name'],
                product_price: cartresults[i]['price'],
                product_image: cartresults[i]['image'],
            })
        }
        res.status(200).send({
            status: 200,
            order: objs
        })
        // res.send({
        //     status: 200,
        //     order: cartresults
        // })
    })
}

module.exports = {
    checkout,
    listcheckout
}