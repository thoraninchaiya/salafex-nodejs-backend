var conn = require('../../connect');
var config = require('../../config');

const getproduct = (req, res)=>{
    // var sqlget = `SELECT * FROM product`;
    // var sqlsearch = `SELECT * FORM product WHERE id = ?`;
    // var params = [req.params.id];
    conn.execute(`SELECT * FROM product`,(geterr, getresults)=>{
        // conn.execute(`SELECT CURRENT_DATE() as date_min FROM product WHERE product_registering_dates_min`,(dateminerr, dateminresults)=>{
            // conn.execute(`SELECT CURRENT_DATE() as date_max FROM product WHERE product_registering_dates_max`,(datemaxerr, datemaxresults)=>{
                var objs = []
                var statuscode = 0
                var registeringcode = null
                var datemin = null
                var datemax = null
                if(geterr) throw geterr


                if (getresults === undefined || getresults.length == 0){
                    return res.status(400).send({
                        message: "ไม่พบข้อมูล",
                        status: 404
                    });
                }

                for(var i=0;i < getresults.length; i++){
                    switch(getresults[i]['status']){
                        case 'active' :
                            statuscode = 1
                            break;
                        case 'unactive' :
                            statuscode = 2 
                            break;
                    }
                    switch(getresults[i]['registering']){
                        case 'false' :
                            registeringcode = 1
                            break;
                        case 'true' :
                            registeringcode = 2 
                            break;
                    }
                    // if(dateminresults[i]['date_min']){
                    //     datemin = dateminresults[i]['date_min']
                    // }
                    // if(datemaxresults[i]['date_max']){
                    //     datemin = datemaxresults[i]['date_max']
                    // }

                    objs.push({
                        secretid: getresults[i]['secretid'],
                        product_id: getresults[i]['id'],
                        product_cost: getresults[i]['cost'],
                        category_id: getresults[i]['category_id'],
                        product_detail: getresults[i]['details'],
                        product_name: getresults[i]['name'],
                        product_price: getresults[i]['price'],
                        product_qty: getresults[i]['product_qty'],
                        sold_qty: getresults[i]['sold_qty'],
                        product_status: getresults[i]['status'],
                        product_status_code: statuscode,
                        product_registering: getresults[i]['registering'],
                        product_registering_code: registeringcode,
                        product_image: config.mainUrl + config.imagePath + getresults[i]['image'],
                        product_registering_dates_min: getresults[i]['product_registering_dates_min'],
                        product_registering_dates_max: getresults[i]['product_registering_dates_max'],
                        // product_registering_date: datemin + ',' + datemax,
                        // product_registering_date: dateminresults[i]['date_min'],
                    })
                }
                return res.status(200).send(objs);                   
        //     })
         
        // })

    })
}


const addproduct = (req, res)=>{
    if(!req.body || !req.files){
        return res.status(400).send({
            status: 400,
            message: "กรุณาตรวจสอข้อมูลใหม่"
        })
    }

    conn.execute(`SELECT * FROM product WHERE id = '${req.body.product_id}'`,(selecterr, selectresults) => {
        if(selecterr) throw err
        if(selectresults === undefined || selectresults.length == 0){
            if(req.files){
                var file = req.files.image
                var fileanmemd5 = file.md5
                var type = file.mimetype
                var cuttype = type.split('/')
                var filename = fileanmemd5 + "." + cuttype[1] //ชื่อไฟล์ md5
    
                file.mv('./store/image/product/'+ fileanmemd5 + "." + cuttype[1], function(err){
                    if(err){res.send(err)}
                    else{
                        conn.execute(`INSERT INTO product (id, category_id, name, cost, price, product_qty, status, image, details) VALUES ('${req.body.product_id}', ${req.body.product_category}, '${req.body.product_name}', ${req.body.product_cost}, ${req.body.product_price}, ${req.body.product_qty}, ${req.body.product_status}, '${filename}', '${req.body.product_detail}')`, (newinserterr, newinsertresults) =>{
                            if(newinserterr) throw newinserterr
                        })
                    }
                })
                return res.status(200).send({
                    status: 200,
                    message: "เพิ่มข้อมูลสำเร็จ"
                })
            }
        }
        return res.status(400).send({
            status: 400,
            message: "มีสินค้าในระบบแล้ว"
        })
    })
}

const editproductstatus = (req, res)=>{
    // {
    //     image: 'null',
    //     product_id: 'M106',
    //     product_name: 'salafex mystery box',
    //     product_cost: '5000',
    //     product_price: '490',
    //     product_qty: '100',
    //     product_status: '1',
    //     product_category: '1',
    //     product_detail: '-',
    //     product_registering_code: '2',
    //     secretid: '6',
    //     category_id: '1',
    //     type: 'updateproduct',
    //     product_registering_date: '2021-11-04,2021-11-11'
    //   }

    if(req.body.product_registering_date){
        var data = req.body.product_registering_date
        var catterdates = data.split(',')
        if(catterdates[0] > catterdates[1]){

            return res.status(400).send({
                status: 400,
                message: "ไม่สามารถกรอกเวลาย้อนหลังได้"
            })
        }
    }
    
    
    if(!req.body.secretid){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }

    if(req.body.type === 'updatestatus'){
        conn.execute(`UPDATE product set status = ${req.body.status} where id = '${req.body.id}'`,(updateerr , updateresult)=>{
            if(updateerr) throw updateerr
            return res.status(200).send({
                status: 200,
                message: "อัพเดตข้อมูลสำเร็จ"
            })
        })
    }
    if(req.body.type === 'updateproduct'){
        conn.execute(`UPDATE product SET id = '${req.body.product_id}', cost = ${req.body.product_cost}, category_id = ${req.body.category_id}, details = '${req.body.product_detail}', name = '${req.body.product_name}', price = ${req.body.product_price}, product_qty = ${req.body.product_qty}, status = ${req.body.product_status}, registering = ${req.body.product_registering_code} WHERE secretid = ${req.body.secretid}`, (updateerr, updateresults) =>{
            if(updateerr) throw updateerr
            if(req.files){
                var file = req.files.image
                var fileanmemd5 = file.md5
                var type = file.mimetype
                var cuttype = type.split('/')
                var filename = fileanmemd5 + "." + cuttype[1] //ชื่อไฟล์ md5
        
                file.mv('./store/image/product/'+ fileanmemd5 + "." + cuttype[1], function(err){
                    if(err){res.send(err)}
                    else{
                        conn.execute(`UPDATE product SET image = '${filename}' WHERE secretid = ${req.body.secretid}`, (updateimageerr, updateimageresults) =>{
                            if(updateimageerr) throw updateimageerr
                            if(catterdates){
                                conn.execute(`UPDATE product SET product_registering_dates_min = '${catterdates[0]}', product_registering_dates_max = '${catterdates[1]}' WHERE secretid = ${req.body.secretid}`, (updateregisteringerr, updateregisteringresults) =>{
                                    if(updateregisteringerr) throw updateregisteringerr

                                    return res.send({
                                        status: 200,
                                        message: "แก้ไขข้อมูลสินค้าสำเร็จ"
                                    })
                                })
                            }
                            return res.send({
                                status: 200,
                                message: "แก้ไขข้อมูลสินค้าสำเร็จ"
                            })
                        })
                    }
                })
            }else{
                if(catterdates){
                    conn.execute(`UPDATE product SET product_registering_dates_min = '${catterdates[0]}', product_registering_dates_max = '${catterdates[1]}' WHERE secretid = ${req.body.secretid}`, (updateregisteringerr, updateregisteringresults) =>{
                        if(updateregisteringerr) throw updateregisteringerr

                        return res.send({
                            status: 200,
                            message: "แก้ไขข้อมูลสินค้าสำเร็จ"
                        })
                    })
                }else{
                    return res.send({
                        status: 200,
                        message: "แก้ไขข้อมูลสินค้าสำเร็จ"
                    })
                }
                
            }
        })
    }
}

function delproduct (req, res){
    if(!req.body.secretid){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    conn.execute(`SELECT * FROM orders_details WHERE product_id = ${req.body.secretid}`, (selectdetailerr, selectdetailresults) => {
        if(selectdetailerr) throw selectdetailerr
        if(selectdetailresults === undefined || selectdetailresults.length == 0){
            conn.execute(`SELECT * FROM product WHERE secretid = ${req.body.secretid} AND registering = 2`, (selproducterr, selproductresults)=>{
                if(selproducterr) throw selproducterr
                if(selproductresults === undefined || selproductresults.length == 0){
                    conn.execute(`DELETE FROM product WHERE secretid = ${req.body.secretid}`, (delitemerr, delitemresults) => {
                        try {
                            if(delitemerr){
                                return res.status(400).send({
                                    status: 400,
                                    message: "ไม่สามารถลบสินค้าได้"
                                })
                            }
                            if(delitemresults){
                                return res.status(200).send({
                                    status: 200,
                                    message: "ลบสินค้าสำเร็จ"
                                })
                            }
                        } catch (error) {
                            return res.status(400).send({
                                status: 400,
                                message: "ไม่สามารถลบสินค้าได้"
                            })
                        }
                    })
                }else{
                    conn.execute(`SELECT * FROM random WHERE product_id = ${req.body.secretid}`,(selrandomerr, selrandomresults) =>{
                        if(selrandomerr) throw selrandomerr
                        if(selrandomresults === undefined || selrandomresults.length == 0){
                            conn.execute(`DELETE FROM product WHERE secretid = ${req.body.secretid}`, (delitemerr, delitemresults) => {
                                try {
                                    if(delitemerr){
                                        return res.status(400).send({
                                            status: 400,
                                            message: "ไม่สามารถลบสินค้าได้"
                                        })
                                    }
                                    if(delitemresults){
                                        return res.status(200).send({
                                            status: 200,
                                            message: "ลบสินค้าสำเร็จ"
                                        })
                                    }
                                } catch (error) {
                                    return res.status(400).send({
                                        status: 400,
                                        message: "ไม่สามารถลบสินค้าได้"
                                    })
                                }
                            })
                        }else{
                            return res.status(400).send({
                                status: 400,
                                message: "ไม่สามารถลบสินค้าได้เนื่องจากมีการลงทะเบียน"
                            })
                        }
                    })
                }
            })
            
        }else{
            return res.status(400).send({
                status: 400,
                message: "ไม่สามารถลบสินค้าได้เนื่องจากมีสินค้าขายแล้ว"
            })
        }
    })
}

function getproductregistering(req, res) {
    var objs = []
    var count = []
    var statuscode = 0
    conn.execute(`SELECT * FROM product WHERE registering = 2`, (selerr, selresults) => {
        if(selerr) throw selerr
        for(var i=0;i < selresults.length; i++){
            // conn.execute(`SELECT product_id,COUNT(*) as count FROM random WHERE product_id = ${selresults[i]['secretid']} GROUP BY product_id`, (counterr, countresults) => {
            //     if(counterr) throw counterr
            //     console.log(countresults)
            //     for(var ia=0; a < countresults; a++){
            //         count.
            //     }
            // })
            switch(selresults[i]['registering']){
                case 'false' :
                    registeringcode = 1
                    break;
                case 'true' :
                    registeringcode = 2 
                    break;
            }

            objs.push({
                secretid: selresults[i]['secretid'],
                product_id: selresults[i]['id'],
                category_id: selresults[i]['category_id'],
                product_detail: selresults[i]['details'],
                product_name: selresults[i]['name'],
                product_registering: selresults[i]['registering'],
                product_qty: selresults[i]['product_qty'],
                product_registering_code: registeringcode,
                product_image: config.mainUrl + config.imagePath + selresults[i]['image'],
                product_registering_date: selresults[i]['product_registering_dates_min'] + ' , ' + selresults[i]['product_registering_dates_max']
            })
            if(i === 3){
                    continue
                }
        }
        
        res.send({
            status: 200,
            data: objs
        })
    })
}

function counting(x, y){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve("Delay Hello");
        }, 1000);
    });
}

// execute(say, "aloha");

module.exports = {
    getproduct,
    addproduct,
    editproductstatus,
    delproduct,
    getproductregistering,
}