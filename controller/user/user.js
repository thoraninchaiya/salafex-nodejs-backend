var conn = require('../../connect');
const { v4: uuidv4 } = require('uuid');



//การขอคีเควสผู้ใช้
const userinfo = (req, res)=>{
    conn.query(`select * from users where uuid = '${req.userData.uuid}'`, (err, results)=>{
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
    conn.query(`SELECT * FROM users WHERE uuid = '${req.userData.uuid}'`, (err, results) =>{
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
            last_login: results[0]['last_login'],
            role: results[0]['role']
        })
    })
}

module.exports = {
    userinfo,
    profile
}