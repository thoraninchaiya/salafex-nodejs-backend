var conn = require('../../connect');
var config = require('../../config');

//การขอคีเควสผู้ใช้
const info = (req, res)=>{
    conn.execute(`select * from users where uuid = '${req.userData.uuid}'`, (err, results)=>{
        try{
            if(err){
                throw (err)
            }
            res.status(200).send({
                uuid: results[0]['uuid'],
                fname: results[0]['fname'],
                lname: results[0]['lname']
            })
        }
        catch{
            return res.status(400).send({
                message: "กรุณาติดต่อผู้ดูแลระบบ",
                status: 400
            })
        }
    })
}

//การขอรีเควสโปรไฟล์
const profile = (req, res)=>{
    conn.execute(`SELECT * FROM users WHERE uuid = '${req.userData.uuid}'`, (err, results) =>{
        if(err){
            throw err
        }
        res.status(200).send({
            email: results[0]['email'],
            uuid: results[0]['uuid'],
            fname: results[0]['fname'],
            lname: results[0]['lname'],
            phone: results[0]['phone'],
            addr: results[0]['addr'],
        })
    })
}

//แก้ไขโปรไฟล์
const edit = (req, res)=>{
    if(!req.body.fname || !req.body.lname || !req.body.addr || !req.body.addr){
        res.status(400).send({
            status: 400,
            message: "กรุณากรอกข้อมูลให้ครบถ้วน"
        })
    }

    conn.execute(`SELECT * FROM users WHERE uuid = '${req.userData.uuid}'`, (err, results) =>{
        try{
            if(err){
                res.status(400).send({
                    status: 400,
                    message: "ระบบผิดพลาด"
                })
            }
            conn.execute(`UPDATE users SET fname = '${req.body.fname}', lname = '${req.body.lname}', phone = '${req.body.phone}', addr = '${req.body.addr}' WHERE uuid = '${req.userData.uuid}'`)
            try{
                res.status(200).send({
                    status: 200,
                    message: "บันทึกข้อมูลสำเร็จ"
                })
            }
            catch{
                return res.status(400).send({
                    message: "ข้อมูลผิดพลาดกรุณากรอกใหม่",
                    status: 400
                })
            }

        }
        catch{
            return res.status(400).send({
                message: "กรุณาติดต่อผู้ดูแลระบบ",
                status: 400
            })
        }

    })
}

function receipthistory (req, res) {
    conn.execute(`SELECT * FROM receipt WHERE users_id = ${req.userDataInfo.id} ORDER BY receipt_id DESC`, (selectordererr, selectorderresults) => {
        if(selectordererr) throw selectordererr
        let objs = []
        for(var i= 0;i < selectorderresults.length; i++){
            objs.push({
                orderid: selectorderresults[i]['order_id'],
                receiptid: selectorderresults[i]['receipt_id'],
                orderserial: selectorderresults[i]['order_serial'],
                receiptserial: selectorderresults[i]['receipt_serial'],
                receiptdate: selectorderresults[i]['receipt_datetime'],
                orderstatus: selectorderresults[i]['receipt_status'],
            })
            if(i === 3){
                continue
            }
        }
        return res.status(200).send({
            status: 200,
            maindata: objs
        })
    })
}

function receipt(req, res) {
    conn.execute(`SELECT * FROM receipt a INNER JOIN receipt_detail b ON a.receipt_id = b.receipt_id INNER JOIN product c ON b.product_id = c.secretid WHERE a.receipt_id = ${req.params.id} AND a.users_id = ${req.userDataInfo.id}`, (seldetailerr, seldetailresults) =>{
        if(seldetailerr) throw seldetailerr
        var objs = []
        var data = []
        if(seldetailresults === undefined || seldetailresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ผิดพลาด"
            })
        }

        data.push({
            orderid: seldetailresults[0]['order_id'],
            receiptid: seldetailresults[0]['receipt_id'],
            orderserial: seldetailresults[0]['order_serial'],
            receiptserial: seldetailresults[0]['receipt_serial'],
            receiptdate: seldetailresults[0]['receipt_datetime'],
            user_address: seldetailresults[0]['user_address'],
            user_name: seldetailresults[0]['user_name'],
            receipttoalamt: seldetailresults[0]['receipt_toal_amt'],
        })
        for(var i = 0;i < seldetailresults.length; i++){
            objs.push({
                productname: seldetailresults[i]['product_name'],
                productid: seldetailresults[i]['product_code'],
                receiptqty: seldetailresults[i]['receipt_qty'],
                productunit: seldetailresults[i]['product_unit_price'],
                producttotalamt: seldetailresults[i]['product_total_amt'],
            })
        }
        return res.status(200).send({
            status: 200,
            data: data,
            detail: objs,
        })
    })
}

module.exports = {
    info,
    profile,
    edit,
    receipthistory,
    receipt
}