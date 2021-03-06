var conn = require('../connect');
var config = require('../config');
const test = null

function getcompanydelivery(req, res) {
    objs = []
    conn.execute(`SELECT * FROM delivery_category_company WHERE delivery_category_company_status = 1`, (compayerr, companyresults) =>{
        if(companyresults === undefined || companyresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบบริษัทขนส่ง"
            })
        }

        for(var i=0;i < companyresults.length; i++){
            objs.push({
                deli_companyu_id: companyresults[i]['delivery_category_company_id'],
                deli_companyu_name: companyresults[i]['delivery_category_company_name'],
            })
            if(i === 3){
                continue
            }
        }
        return res.send({
            status: 200,
            data: objs
        })
    })
}

function getdelivery(req, res) {
    conn.execute(`SELECT * FROM receipt WHERE receipt_id = ${req.params.receiptid}`, (selrecerr, selrecresults) => {
        if(selrecerr) throw selrecerr
        if(selrecresults === undefined || selrecresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบข้อมูลการส่งสินค้ากรุณาติดต่อเจ้าหน้าที่"
            })
        }
        conn.execute(`SELECT * FROM delivery a INNER JOIN delivery_category_company b ON a.delivery_company_id = b.delivery_category_company_id WHERE receipt_id = ${req.params.receiptid}`, (seldeliveryerr, seldeliveryresults) => {
            if(seldeliveryerr) throw seldeliveryerr
            if(seldeliveryresults === undefined || seldeliveryresults.length == 0){
                return res.status(400).send({
                    status: 400,
                    message: "ไม่พบข้อมูลการส่งสินค้ากรุณาติดต่อเจ้าหน้าที่"
                })
            }
            return res.status(200).send({
                status: 200,
                company: seldeliveryresults[0]['delivery_category_company_name'],
                serial: seldeliveryresults[0]['delivery_serial']
            })
        })
    })
}

module.exports = {
    getdelivery,
    getcompanydelivery
}