var conn = require('../connect');
var config = require('../config');

const checkout = (req, res) => {
    conn.execute(`SELECT * FROM cart LEFT JOIN product ON cart.product_id = product.id WHERE users_id = ${req.userDataInfo.id} AND cart_status = 'pending'`, (selecterror, selectresults) => {
        if(selecterror){
            throw(selecterror)
        }
        // console.log(selectresults)
        conn.execute(`INSERT INTO orders (users_id, order_serial) VALUES (${req.userDataInfo.id}, 'serial')`, (inserterr, inserresults) =>{
            if(inserterr) throw inserterr
            const incart = selectresults
            incart.forEach(element => {
                conn.execute(`INSERT INTO orders_details(order_id, product_id, order_qty, product_total_amt) VALUES (${inserresults.insertId}, '${element.product_id}', ${element.cart_qty}, ${element.cart_qty * element.price})`, (detailerr, detailresults) => {
                    if(detailerr) throw detailerr
                    // console.log(detailresults)
                    // console.log(element)
                    conn.execute(`UPDATE orders a INNER JOIN (SELECT order_id, SUM(product_total_amt) as total FROM orders_details GROUP BY order_id) b ON a.order_id = b.order_id SET a.order_total_amt = b.total WHERE a.order_id = ${inserresults.insertId}`, (orderamterr, orderamtresults) => {
                        if(orderamterr) throw orderamterr
                        // console.log(orderamtresults)
                    })
                })
            })
        })
    })
}

const listcheckout = (req, res) => {
    conn.execute(`SELECT * FROM cart a INNER JOIN product b ON a.product_id = b.id WHERE a.cart_status = 'pending' AND b.status = "active"`, (carterr, cartresults) => {
        if(carterr) throw carterr
        console.log(cartresults)

        res.send({
            status: 200
        })
    })
}

module.exports = {
    checkout,
    listcheckout
}