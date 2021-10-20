// import URL from '../../config';
var config = require('../config');
var conn = require('../connect');
var onstock = null


const newproduct = (req, res)=>{
    conn.execute(`SELECT * FROM product WHERE status = "active" and registering = "false" ORDER BY secretid DESC LIMIT 6`, (error, results, fields)=>{
        if(error) throw error
        var objs = [];
        if (results === undefined || results.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูลในขณะนี้",
                status: 404
            });
        }
        for (var i = 0;i < results.length; i++) {
            if(results[i]['product_qty'] > 0){
                var onstock = true
            }else{
                var onstock = false
            }
            objs.push({
              id: results[i].secretid,
              cid: results[i].category_id,
              pid: results[i].id,
              name: results[i].name,
              price: results[i].price,
              image: config.mainUrl + config.imagePath + results[i].image,
              onstock: onstock 
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        res.end();
    })
}

//get product
const products = (req, res)=>{
    conn.execute(`SELECT * FROM product WHERE status = "active" and registering = "false"`, (error, results, fields)=>{
        if(error) throw error;
        var objs = [];
        if (results === undefined || results.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูลในขณะนี้",
                status: 404
            });
        }
        for (var i = 0;i < results.length; i++) {
            if(results[i]['product_qty'] > 0){
                var onstock = true
            }else{
                var onstock = false
            }
            objs.push({
              id: results[i].secretid,
              cid: results[i].category_id,
              pid: results[i].id,
              name: results[i].name,
              price: results[i].price,
              image: config.mainUrl + config.imagePath + results[i].image,
              onstock: onstock              
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        res.end();
    })
}

//get product
const registeringproducts = (req, res)=>{
    
    conn.execute(`SELECT * FROM product WHERE status = "active" and registering = "true"`, (error, results, fields)=>{
        if(error) throw error;
        var objs = [];
        if (results === undefined || results.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูลในขณะนี้",
                status: 404
            });
        }
        for (var i = 0;i < results.length; i++) {
            if(results[i]['product_qty'] > 0){
                var onstock = true
            }else{
                var onstock = false
            }
            objs.push({
              id: results[i].secretid,
              cid: results[i].category_id,
              pid: results[i].id,
              name: results[i].name,
              price: results[i].price,
              image: config.mainUrl + config.imagePath + results[i].image,
              onstock: onstock
            });
        }

        // console.log(req)
        // console.log(req.userData)
        return res.status(200).send({
            product: objs
        })

    })
}

function bestseller(req, res) {
 conn.execute(`SELECT * FROM product ORDER BY sold_qty DESC LIMIT 6`, (bserr, bsresults) => {
     if(bserr) throw bserr
    //  console.log(bsresults)
     var objs = [];

    if (bsresults === undefined || bsresults.length == 0){
        return res.status(400).send({
            message: "ไม่พบข้อมูลในขณะนี้",
            status: 404
        });
    }

    for (var i = 0;i < bsresults.length; i++) {
        objs.push({
          id: bsresults[i].secretid,
          cid: bsresults[i].category_id,
          pid: bsresults[i].id,
          name: bsresults[i].name,
          price: bsresults[i].price,
          image: config.mainUrl + config.imagePath + bsresults[i].image
        });
    }
    
    return res.status(200).send({
        status: 200,
        data: objs
    })
 })
}

function registering(req, res) {
    // console.log(req.userDataInfo.id)
    // console.log(req.body)
    conn.execute(`SELECT * FROM product WHERE secretid = ${req.body.pid} AND registering = 2`,(selproducterr, selproductresults) =>{
        if(selproducterr) throw selproducterr

        if(selproductresults === undefined || selproductresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "เกิดข้อผิดพลาด"
            })
        }

        conn.execute(`SELECT * FROM random WHERE product_id = ${req.body.pid} AND user_id = ${req.userDataInfo.id} AND random_status = 1`, (selrandomerr, selresultseresults) => {
            if(selrandomerr) throw selrandomerr
            // console.log(selresultseresults)
            if(selresultseresults === undefined || selresultseresults.length == 0){
                conn.execute(`INSERT INTO random(product_id, user_id, random_status) VALUES (${selproductresults[0]['secretid']}, ${req.userDataInfo.id}, 1)`, (insrandomerr, insrandomresults) =>{
                    if(insrandomerr) throw insrandomerr
                    // console.log(insrandomresults)
                    return res.status(200).send({
                        status: 200,
                        message: "ลงทะเบียนสำเร็จ"
                    })
                })
            }else{
                return res.status(400).send({
                    status: 400,
                    message: "ท่านได้ลงทะเบียนเรียบร้อยแล้ว"
                })
            }
        })
    })

}

module.exports = {
    products,
    newproduct,
    registeringproducts,
    bestseller,
    registering
}