var config = require('../config');
var conn = require('../connect');


function registering(req, res) {
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
            if(selresultseresults === undefined || selresultseresults.length == 0){
                conn.execute(`INSERT INTO random(product_id, user_id, random_status) VALUES (${selproductresults[0]['secretid']}, ${req.userDataInfo.id}, 1)`, (insrandomerr, insrandomresults) =>{
                    if(insrandomerr) throw insrandomerr
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

function getregistering(req, res) {
    var objs= []
    if(!req.params){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    conn.execute(`SELECT * FROM product WHERE secretid = ${req.params.product} AND registering = 2`, (selerr, selresults)=>{
        if(selerr) throw selerr
        if(selresults === undefined || selresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ผิดพลาด"
            })
        }
        conn.execute(`SELECT * FROM random a INNER JOIN users b ON a.user_id = b.id WHERE a.product_id = ${req.params.product} AND a.random_status = 1 OR a.random_status = 2 OR a.random_status = 4`, (selrandomerr, selrandomresults) =>{
            if(selrandomerr) throw selrandomerr
            // if(selrandomresults === undefined || selrandomresults.length == 0){
            //     return res.status(400).send({
            //         status: 400,
            //         message: "ผิดพลาด 1"
            //     })
            // }
            for(var i=0;i < selrandomresults.length; i++){
                objs.push({
                    name: selrandomresults[i]['fname'] + " " + selrandomresults[i]['lname']
                })
                if(i === 3){
                    continue
                }
            }
            return res.status(200).send({
                status: 200,
                users: objs
            })
        })
    })
}

function success(req, res) {
    var objs= []
    if(!req.params){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    conn.execute(`SELECT * FROM product WHERE secretid = ${req.params.product} AND registering = 2`, (selerr, selresults)=>{
        if(selerr) throw selerr
        if(selresults === undefined || selresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ผิดพลาด"
            })
        }
        conn.execute(`SELECT * FROM random a INNER JOIN users b ON a.user_id = b.id WHERE a.product_id = ${req.params.product} AND a.random_status = 2 OR a.random_status = 4`, (selrandomerr, selrandomresults) =>{
            if(selrandomerr) throw selrandomerr
            // if(selrandomresults === undefined || selrandomresults.length == 0){
            //     return res.status(400).send({
            //         status: 400,
            //         message: "ผิดพลาด 1"
            //     })
            // }
            for(var i=0;i < selrandomresults.length; i++){
                objs.push({
                    name: selrandomresults[i]['fname'] + " " + selrandomresults[i]['lname']
                })
                if(i === 3){
                    continue
                }
            }
            return res.status(200).send({
                status: 200,
                users: objs
            })
        })
    })
}

module.exports = {
    registering,
    getregistering,
    success
}