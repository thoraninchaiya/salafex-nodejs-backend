var conn = require('../../connect');
var config = require('../../config');

const order = (req, res)=>{
    conn.execute(`SELECT * FROM orders`, (ordererr, orderresult)=>{
        if(ordererr) throw ordererr

        if (orderresult === undefined || orderresult.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูล",
                status: 404
            });
        }

        conn.execute(`SELECT fname, lname FROM users WHERE id = ${orderresult[0]['users_id']}`, (usererr, userresults) => {
            if(usererr) throw usererr
            // console.log(userresults)
        
        // console.log(orderresult)

        var objs = []
        conn.execute(`SELECT count(*) FROM orders where day(order_datetime)=day(now())`, (dayerr, dayresults) => {
            if(dayerr) throw dayerr
            // console.log(dayresults)
        
        for(var i=0;i < orderresult.length; i++){
            var status = []
            var statuscode = []
            switch(orderresult[i]['order_status']){
                case "success": status = "สำเร็จ"; statuscode = 1; break;
                case "pending": status = "กำลังดำเนินการ"; statuscode = 2; break;
                case "waitingpayment": status = "รอชำระเงิน"; statuscode = 3; break;
                case "cancel": status = "ยกเลิก"; statuscode = 4; break;
            }
            // console.log(orderresult[i]['order_datetime'].toDateString())
            objs.push({
                id: orderresult[i]['order_id'],
                user: userresults[0]['fname'] + " " + userresults[0]['lname'],
                datetime: orderresult[i]['order_datetime'].toDateString(),
                total_amt: orderresult[i]['order_total_amt'],
                status: status,
                statuscode: statuscode,
                serial: orderresult[i]['order_serial'],
            })
        }
        return res.status(200).send({
            order: objs,
            order_today: dayresults[0]['count(*)']
        })
        })
        })
    })
}

module.exports = {
    order
}