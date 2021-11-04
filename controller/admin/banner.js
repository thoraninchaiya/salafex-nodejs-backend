var conn = require('../../connect');
var config = require('../../config');


function get(req, res) {
    var statuscode = null
    conn.execute(`SELECT * FROM carousel`, (err, results) => {
        var objs = []
        if(err) throw err
        if(results === undefined || results.length == 0){
            return res.send({
                status: 400,
                message: "ไม่พบแบนเนอร์"
            })
        }
        for(var i=0;i < results.length; i++){
            switch(results[i]['status']){
                case 'active' :
                    statuscode = 1
                    break;
                case 'unactive' :
                    statuscode = 2 
                    break;
            }
            objs.push({
                id: results[i]['id'],
                image: config.mainUrl + config.imgCarousel + results[i]['image'],
                status: results[i]['status'],
                status_code: statuscode
            })
        }
        return res.send({
            status: 200,
            data: objs
        })
    })
}

function add(req, res) {
    // console.log(req.body)
    // console.log(req.files)

    if(!req.body.status_code || !req.files){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }

    if(req.files){
        var file = req.files.image
        var fileanmemd5 = file.md5
        var type = file.mimetype
        var cuttype = type.split('/')
        var filename = fileanmemd5 + "." + cuttype[1] //ชื่อไฟล์ md5

        file.mv('./store/image/carousel/'+ fileanmemd5 + "." + cuttype[1], function(err){
            if(err){res.send(err)}
            else{
                conn.execute(`INSERT INTO carousel (image, status) VALUES ('${filename}', ${req.body.status_code})`, (inserterr, insertresults) =>{
                    if(inserterr) throw inserterr
                })
            }
        })
        return res.status(200).send({
            status: 200,
            message: "เพิ่มข้อมูลสำเร็จ"
        })
    }
}

function edit(req, res) {
    console.log(req.body)
    console.log(req.files)
    if(!req.body.banner_id || !req.body.type || !req.body.banner_status_code){
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    conn.execute(`SELECT * FROM carousel WHERE id = ${req.body.banner_id}`, (err, results)=>{
        if(err) throw err
        if(req.body.type === 'updatestatus'){
            conn.execute(`UPDATE carousel SET status = ${req.body.status_code} WHERE id = ${req.body.banner_id}`, (uerr, uresults) =>{
                if(uerr) throw uerr
                return res.send({
                    status: 200,
                    message: "แก้ไขสถานะสำเร็จ"
                })
            })
        }
        if(req.body.type === 'edit'){
            conn.execute(`UPDATE carousel SET status = ${req.body.banner_status_code} WHERE id = ${req.body.banner_id}`, (ueerr, ueresults) =>{
                if(ueerr) throw ueerr
                if(req.files){
                    var file = req.files.image
                    var fileanmemd5 = file.md5
                    var type = file.mimetype
                    var cuttype = type.split('/')
                    var filename = fileanmemd5 + "." + cuttype[1] //ชื่อไฟล์ md5
        
                    file.mv('./store/image/carousel/'+ fileanmemd5 + "." + cuttype[1], function(err){
                        if(err){res.send(err)}
                        else{
                            conn.execute(`UPDATE carousel SET image = '${filename}', status = ${req.body.banner_status_code} WHERE id = ${req.body.banner_id}`, (updateimgerr, updateimgresults) =>{
                                if(updateimgerr) throw updateimgerr
                                return res.status(200).send({
                                    status: 200,
                                    message: "แก้ไขข้อมูลสำเร็จ"
                                })
                            })
                        }
                    })
                }else{
                    return res.status(200).send({
                        status: 200,
                        message: "เพิ่มข้อมูลสำเร็จ"
                    })
                }
            })
            
            // conn.execute(`UPDATE carousel SET name = '${req.body.name} WHERE id = ${req.body.id}'`, (ueerr, ueresults) =>{
            //     if(ueerr) throw ueerr
            //     return res.send({
            //         status: 200,
            //         message: "แก้ไขแบนเนอร์สำเร็จ"
            //     })
            // })
        }
    })
}

function del(req, res) {
    if(!req.body.id){
        return resstatus(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
    conn.execute(`SELECT * FROM carousel WHERE id = ${req.body.id}`, (err, results) =>{
        if(err) throw err
        if(results === undefined || results.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบแบนเนอร์"
            })
        }
        conn.execute(`DELETE FROM carousel WHERE id = ${req.body.id}`, (delerr, delresults) =>{
            if(delerr) throw delerr
            return res.send({
                status: 200,
                message: "ลบแบนเนอร์สำเร็จ"
            })
        })
    })
}

module.exports = {
    get,
    add,
    edit,
    del
}
