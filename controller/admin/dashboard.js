var conn = require('../../connect');
var config = require('../../config');

function ordercount(req, res) { //จำนวนคำสั่งซื้อวันนี้
    var objs = []
    conn.execute(`SELECT COUNT(*) as ordercount FROM orders WHERE day(order_datetime)=day(now())`, (selcounterr, selcountresults) => {
        if(selcounterr) throw selcounterr
        // console.log(selresults)
        conn.execute(`SELECT * FROM receipt a WHERE day(a.receipt_datetime)=day(now())`,(selerr, selresults) =>{
            if (selerr) throw selerr
            // console.log(selresults)
            for(var i=0; i < selresults.length; i++){
                objs.push({
                    receipt_id: selresults[i]['receipt_id'],
                    receipt_serial: selresults[i]['receipt_serial'],
                    users_id :selresults[i]['users_id'],
                    users_name: selresults[i]['user_name'],
                    user_address: selresults[i]['user_address'],
                    order_id: selresults[i]['order_id'],
                    order_serial: selresults[i]['order_serial'],
                    receipt_datetime: selresults[i]['receipt_datetime'],
                    receipt_toal_amt: selresults[i]['receipt_toal_amt'],
                    receipt_status: selresults[i]['receipt_status'],
                })
            }
            return res.send({
                status: 200,
                ordercount: selcountresults[0]['ordercount'],
                orderlist: objs
            })
        })
    })
}

function orderdetail(req, res) {
    conn.execute(`SELECT * FROM receipt a WHERE day(a.receipt_datetime)=day(now())`,(selerr, selresults) =>{
        if (selerr) throw selerr
        console.log(selresults)
        return res.send({
            
        })
    })
}

module.exports = {
    ordercount,
    orderdetail,

}

// ordercount
// orderdetail
// sales