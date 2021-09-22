var conn = require('../connect');
var config = require('../config');

const checkout = (req, res) => {
    conn.execute(`SELECT * FROM cart WHERE users_id = ${req.userDataInfo.id} AND cart_status = 'pending'`, (selecterror, selectresults) => {
        if(selecterror){
            throw(selecterror)
        }
        conn.execute(`INSERT INTO orders (users_id, order_serial) VALUES (${req.userDataInfo.id}, 'serial')`, (inserterr, inserresults) =>{
            if(inserterr) throw inserterr
            const incart = selectresults
            incart.forEach(element => {
                conn.execute(`INSERT INTO orders_details(order_id, product_id, order_qty) VALUES (${inserresults.insertId}, '${element.product_id}', ${element.cart_qty})`, (detailerr, detailresults) => {
                    if(detailerr) throw detailerr
                    console.log(detailresults)
                })
            })
        })
    })
}


module.exports = {
    checkout
}