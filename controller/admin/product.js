var conn = require('../../connect');
var config = require('../../config');

const getproduct = (req, res)=>{
    // var sqlget = `SELECT * FROM product`;
    // var sqlsearch = `SELECT * FORM product WHERE id = ?`;
    // var params = [req.params.id];
    conn.execute(`SELECT * FROM product`,(geterr, getresults)=>{
        var objs = []
        var statuscode = 0
        var registeringcode = null
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
                product_image: config.mainUrl + config.imagePath + getresults[i].image,
            })
        }
        return res.status(200).send(objs);
    })
}


const addproduct = (req, res)=>{
    console.log(req.body.product_name)
    if(!req.body || !req.files){
        return res.status(400).send({
            status: 400,
            message: "ข้อมูลผิดพลาด"
        })
    }
    conn.execute(`SELECT * FROM product WHERE LOWER(id) = LOWER('${req.body.product_name}')`,(selecterr, selectresults) => {
        if(selecterr) throw err
        // console.log(selectresults)
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
    console.log(req.body)
    if(req.body.type === 'updatestatus'){
        conn.execute(`UPDATE product set status = ${req.body.status} where id = '${req.body.id}'`,(updateerr , updateresult)=>{
            try{
                if(updateerr) throw updateerr
                return res.status(200).send({
                    status: 200,
                    message: "อัพเดตข้อมูลสำเร็จ"
                })
            }catch{
                return res.status(400).send({
                    status: 400,
                    message: "ระบบผิดพลาด"
                })
            }
        })
    }
    // if(req.body.type === 'updateproduct'){
        
    // }
    else{
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
}

const delproduct = (req, res)=>{
    console.log(req)
}

module.exports = {
    getproduct,
    addproduct,
    editproductstatus,
    delproduct
}