var conn = require('../../connect');
var config = require('../../config');
const random = require('random')

function getinfo(req, res) {
    if (!req.body.product_id){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    const objs = []
    conn.execute(`SELECT product_id,COUNT(*) as count FROM random a INNER JOIN product b ON a.product_id = b.secretid WHERE product_id = ${req.body.product_id} AND random_status = 1 `,(counterr, countresults)=>{

        conn.execute(`SELECT * FROM random a INNER JOIN users b ON a.user_id = b.id WHERE product_id = ${req.body.product_id} AND random_status = 1 OR random_status = 2 OR random_status = 4`,(selrandomlisterr, selrandomlistresults) =>{
            if(selrandomlisterr) throw selrandomlisterr
            var registering_code = null

            for(var i = 0; i < selrandomlistresults.length; i++){
                switch(selrandomlistresults[i]['random_status']){
                    case 'registeering':
                        registering_code = 1
                        break;
                    case 'waitbuy':
                        registering_code = 2
                        break;
                    case 'pending':
                        registering_code = 3
                        break
                    case 'success':
                        registering_code = 4
                        break;
                    case 'cancel':
                        registering_code = 5
                        break
                    case 'fail':
                        registering_code = 6
                        break;
                }

                objs.push({
                    user: selrandomlistresults[i]['fname'] + ' ' + selrandomlistresults[i]['lname'],
                    status: selrandomlistresults[i]['random_status'],
                    status_code: registering_code
                })
            }
            return res.send({
                status: 200,
                data: objs,
                count_registering: countresults[0]['count']
            })
        })
    })  
}

function register(req, res) {
    const reqcount = parseInt(req.body.count)
    var randomlist = []
    //{ product_id: 6, count: '10' }
    if(!req.body.product_id || !req.body.count){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    conn.execute(`SELECT * FROM product WHERE registering = 2 AND secretid = ${req.body.product_id}`,(selerr, selresults) =>{
        if(selerr) throw selerr
        if(selresults === undefined || selresults.length == 0){
            return res.statsu(400).send({
                status: 400,
                message: "ไม่พบสินค้า"
            })
        }

        conn.execute(`SELECT * FROM random WHERE product_id = ${req.body.product_id} AND random_status = 1`,(selrandomerr, selrandomresults) =>{
            if(selrandomerr) throw selrandomerr
            if(req.body.count >= selrandomresults.length){
                return res.send({
                    status: 200,
                    message: "ทุกท่านได้รับสินค้าเนื่องจากสินค้ามีมากกว่าจำนวนผู้ที่ลงทะเบียน"
                })
            }
            if(req.body.count < selrandomresults.length){
                var i = 1
                function loop(){
                    setTimeout(() => {
                        conn.execute(`SELECT * FROM random WHERE product_id = ${req.body.product_id} AND random_status = 1`, (selrandomlooperr, selrandomloopresults) =>{
                            if(selrandomlooperr) throw selrandomlooperr
                            var randomcount = random.int((min = 0), (max = reqcount))
                            conn.execute(`INSERT INTO random_cash (cash_user_id, cash_product_id) VALUES (${selrandomloopresults[randomcount]['user_id']}, ${req.body.product_id})`,(inserterr, insertresultresults) =>{
                                if(inserterr) throw inserterr
                            })
                        })

                        i++
                        if(i-1 < reqcount){
                            loop()
                        }
                    }, 500);
                    if(i >= reqcount){
                        return res.send({
                            status: 200,
                            message: "ดำเนินการสุ่มสำเร็จ"
                        })
                    }
                }
                loop();
            }
        })
    })
}

function getregisternoconfirm(req, res){
    objs = []
    conn.execute(`SELECT * FROM random_cash a INNER JOIN users b ON a.cash_user_id = b.id WHERE cash_product_id = ${req.body.product_id}`, (selerr, selresults) =>{
        if(selerr) throw selerr
        if(selresults === undefined || selresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบข้อมูล"
            })
        }
        
        for(var i=0; i < selresults.length ; i++){
            objs.push({
                user: selresults[i]['fname'] + ' ' + selresults[i]['lname'],
                user_id: selresults[i]['id'],
            })
        }
        return res.send({
            status: 200,
            data: objs,
            message: "ดึงข้อมูลสำเร็จ"
        })
    })
}

function clearregisternoconfirm(req, res){
    objs = []
    conn.execute(`SELECT * FROM random_cash WHERE cash_product_id = ${req.body.product_id}`, (selerr, selresults) =>{
        if(selerr) throw selerr
        if(selresults === undefined || selresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบข้อมูล"
            })
        }
        conn.execute(`DELETE FROM random_cash WHERE cash_product_id = ${req.body.product_id}`, (delerr, delresults) =>{
            if(delerr) throw delerr
            
            return res.send({
                status: 200,
                message: "ลบสำเร็จ"
            })
        })
    })
}

function confirm(req, res) {
    console.log(req.body)
    conn.execute(`SELECT * FROM random_cash WHERE cash_product_id = ${req.body.product_id}`, (selerr, selresults)=>{
        if(selerr) throw selerr
        var data = selresults
        var i = 0
        function loop(){
            setTimeout(() => {
                conn.execute(`UPDATE random SET random_status = 2 WHERE product_id = ${req.body.product_id} AND user_id = ${data[i]['cash_user_id']} AND random_status = 1`, (updateerr, updateresults) =>{
                  if(updateerr) throw updateerr
                })

                i++
                if(i < selresults.length){
                    loop()
                }
            }, 500);
            if(i >= selresults.length){
                return res.send({
                    status: 200,
                    message: "ยืนยันผลการสุ่มสำเร็จ"
                })
            }
        }
        loop();
        
    })
}

function success(req, res) {
    var objs = []
    conn.execute(`SELECT * FROM random a INNER JOIN users b ON a.user_id = b.id WHERE product_id = ${req.body.product_id} AND random_status = 2 OR random_status = 4`,(selrandomlisterr, selrandomlistresults) =>{
        if(selrandomlisterr) throw selrandomlisterr
        var registering_code = null

        for(var i = 0; i < selrandomlistresults.length; i++){
            objs.push({
                user: selrandomlistresults[i]['fname'] + ' ' + selrandomlistresults[i]['lname']
            })
        }
        return res.send({
            status: 200,
            data: objs,
        })
    })
}

module.exports = {
    getinfo,
    register,
    getregisternoconfirm,
    clearregisternoconfirm,
    confirm,
    success
}