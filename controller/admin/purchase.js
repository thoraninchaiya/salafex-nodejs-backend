var conn = require('../../connect');
var config = require('../../config');

function order (req, res){
    conn.execute(`SELECT * FROM orders`, (ordererr, orderresult)=>{
        if(ordererr) throw ordererr

        if (orderresult === undefined || orderresult.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูล",
                status: 404
            });
        }
        conn.execute(`SELECT count(*) FROM orders WHERE day(order_datetime)=day(now())`, (dayerr, dayresults) => {
            if(dayerr) throw dayerr
        
        // for(var i=0;i < orderresult.length; i++){
        //     var status = []
        //     var statuscode = []
        //     switch(orderresult[i]['order_status']){
        //         case "success": status = "สำเร็จ"; statuscode = 1; break;
        //         case "pending": status = "กำลังดำเนินการ"; statuscode = 2; break;
        //         case "waitingpayment": status = "รอชำระเงิน"; statuscode = 3; break;
        //         case "cancel": status = "ยกเลิก"; statuscode = 4; break;
        //     }
        //     // console.log(orderresult[i]['order_datetime'].toDateString())
        //     objs.push({
        //         id: orderresult[i]['order_id'],
        //         user: userresults[0]['fname'] + " " + userresults[0]['lname'],
        //         datetime: orderresult[i]['order_datetime'].toDateString(),
        //         total_amt: orderresult[i]['order_total_amt'],
        //         status: status,
        //         statuscode: statuscode,
        //         serial: orderresult[i]['order_serial'],
        //     })
        // }
        return res.status(200).send({
            order_today: dayresults[0]['count(*)']
        })
        })
    })
}

function receipts (req, res){
    var objs = []
    conn.execute(`SELECT * FROM receipt a INNER JOIN users b ON a.users_id = b.id ORDER BY a.receipt_id DESC`, (selreceipterr, selreceiptresults) => {
        if(selreceipterr) throw selreceipterr
        if(selreceiptresults === undefined || selreceiptresults.length == 0){
            return res.status(400).send({
                status: 400,
            })
        }

        for(var i=0;i < selreceiptresults.length; i++){
            var status = []
            var statuscode = []
            switch(selreceiptresults[i]['receipt_status']){
                case "waitpaid": status = "รอชำระเงิน"; statuscode = 1; break;
                case "pending": status = "รอการตรวจสอบ"; statuscode = 2; break;
                case "success": status = "สำเร็จ"; statuscode = 3; break;
                case "cancel": status = "ยกเลิก"; statuscode = 4; break;
                case "waitdelivery": status = "รอการจัดส่ง"; statuscode = 5; break;
            }
            objs.push({
                receiptid: selreceiptresults[i]['receipt_id'],
                // sort: selreceiptresults[i]['receipt_id'],
                receiptidserial: selreceiptresults[i]['receipt_serial'],
                orderserial: selreceiptresults[i]['order_serial'],
                name: selreceiptresults[i]['fname'] + [" "] + selreceiptresults[i]['lname'],
                receipt_date: selreceiptresults[i]['receipt_datetime'],
                receipttotal: selreceiptresults[i]['receipt_toal_amt'],
                receiptstatus: status,
                receiptstatuscode: statuscode
            })
            if(i === 3){
                continue;
            }
        }
        res.status(200).send({
            status: 200,
            data: objs
        })
    })
}

function cancelreceipts(req, res) {
    conn.execute(`SELECT * FROM receipt WHERE receipt_id = ${req.body.receiptid} `,(selrecerr, selresresults) =>{
        if(selrecerr) throw selrecerr
        if(selresresults === undefined || selresresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่สามารถทำรายการได้"
            })
        }
        if(selresresults[0]['receipt_status'] === "success" || selresresults[0]['receipt_status'] === "cancel"){
            return res.status(400).send({
                status: 400,
                message: "ไม่สามารถเปลี่ยนสถานะได้"
            })
        }else{
            conn.execute(`UPDATE receipt SET receipt_status = 4 WHERE receipt_id = ${req.body.receiptid}`, (updaterecerr, updaterecresults) => {
                if(updaterecerr) throw updaterecerr
                res.status(200).send({
                    status: 200,
                    message: "เปลี่ยนสถานะสำเร็จ"
                })
            })
        }
    })

}

function getreceipt(req, res) {
    
    if(!req.body.receiptid){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }

    var data = []
    var main = []
    var payment = []
    conn.execute(`SELECT * FROM receipt WHERE receipt_id = ${req.body.receiptid}`, (selgetreceipterr, selgetreceiptresults) => {
        if(selgetreceipterr) throw selgetreceipterr
        conn.execute(`SELECT * FROM receipt INNER JOIN receipt_detail ON receipt.receipt_id = receipt_detail.receipt_id WHERE receipt.receipt_id = ${selgetreceiptresults[0]['receipt_id']}`, (selrecerr, selrecresults) =>{
            if(selrecerr) throw selrecerr

            if(selrecresults === undefined || selrecresults.length == 0){
                return res.status(400).send({
                    status: 400,
                    message: "ไม่มีข้อมูลใบเสร็จนี้"
                })
            }

            conn.execute(`SELECT * FROM payment WHERE receipt_id = ${req.body.receiptid}`, (selpaymenterr, selpaymentresults) => {
                // console.log(selpaymentresults)
                if(selpaymenterr) throw selpaymenterr
                if(selpaymentresults === undefined || selpaymentresults.length == 0){
                    payment.push({
                        status: 400,
                        message: "ไม่มีหลักฐานการชำระเงิน"
                    })
                }else{
                    payment.push({
                        status: 200,
                        image: config.mainUrl + config.adminpaymentslip + selpaymentresults[0]['payment_image'],
                        payment_price: selpaymentresults[0]['payment_price'],
                        payment_time: selpaymentresults[0]['payment_time'],
                    })
                }
                
                main.push({
                    receiptid: selrecresults[0]['receipt_id'],
                    receiptserial: selrecresults[0]['receipt_serial'],
                    useraddress: selrecresults[0]['user_address'],
                    receipttotalamt: selrecresults[0]['receipt_toal_amt'],
                })

                for(var i=0;i < selrecresults.length; i++){
                    data.push({
                        productname: selrecresults[i]['product_name'],
                        receiptqty: selrecresults[i]['receipt_qty'],
                        producttotalamt: selrecresults[i]['product_total_amt'],
                        productcode: selrecresults[i]['product_code'],
                    })
                    if(i === 3){
                        continue
                    }
                }
                return res.status(200).send({
                    status: 200,
                    data: data,
                    main: main,
                    paymentdata: payment
                })
            })
        })
    })
}

function updatedelivery(req, res) {
    if(!req.body.company || !req.body.serial || !req.body.receiptid){
        return res.status(400).send({
            status: 400,
            message: "กรุณากรอกข้อมูลให้ครบถ้วน"
        })
    }
    conn.execute(`SELECT * FROM receipt WHERE receipt_id = ${req.body.receiptid}`, (selrecerr, selrecresults) => {
        if(selrecerr) throw selrecerr
        if(selrecresults === undefined || selrecresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบข้อมูล"
            })
        }
        conn.execute(`INSERT INTO delivery (delivery_company_id, delivery_serial, receipt_id) VALUES (${req.body.company}, '${req.body.serial}', ${req.body.receiptid})`, (inserterr, insertresults) =>{
            if(inserterr) throw inserterr
            if(insertresults){
                conn.execute(`UPDATE receipt SET receipt_status = 3 WHERE receipt_id = ${req.body.receiptid}`, (updateerr, updatereuslts) =>{
                    if(updateerr) throw updateerr
                    
                    return res.status(200).send({
                        status: 200,
                        message: "เพิ่มข้อมูลสำเร็จ"
                    })
                })
            }
        })
    })
}


function deliverylist(req, res) {
    let objs= []
    conn.execute(`SELECT * FROM delivery_category_company WHERE delivery_category_company_status = 1`,(deliverycompanyerr, deliverycompanyresults) => {
        if(deliverycompanyerr) throw deliverycompanyerr
        if(deliverycompanyresults === undefined || deliverycompanyresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบข้อมูลบริษัทขนส่ง"
            })
        }
        for(var i = 0;i < deliverycompanyresults.length; i++){
            objs.push({
                id: deliverycompanyresults[i]['delivery_category_company_id'],
                name: deliverycompanyresults[i]['delivery_category_company_name']
            })
        }
        return res.status(200).send({
            status: 200,
            data: objs
        })
    })
}

module.exports = {
    order,
    receipts,
    cancelreceipts,
    getreceipt,
    updatedelivery,
    deliverylist
}