var conn = require('../../connect');
var config = require('../../config');

function payment(req, res) {
    conn.execute(`SELECT * FROM receipt WHERE receipt_id = ${req.body.receiptid} AND receipt_status = 2`, (selrecerr, selrecresults) => {
        if(selrecerr) throw selrecerr
        if(selrecresults === undefined || selrecresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบข้อมูล"
            })
        }
        conn.execute(`UPDATE receipt SET receipt_status = 5 WHERE receipt_id = ${req.body.receiptid}`,(urecerr, urecresults) => {
            if(urecerr) throw urecerr
            return res.status(200).send({
                status: 200,
                message: "แก้ไขข้อมูลสำเร็จ"
            })
        })
    })
}


module.exports = {
    payment
}