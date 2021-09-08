var conn = require('../../connect');
const { v4: uuidv4 } = require('uuid');



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

module.exports = {
    info,
    profile,
    edit
}