var conn = require('../../connect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
// const conn = connect.promise();

const register = (req, res, next) => {
    conn.execute(`SELECT id FROM users WHERE LOWER(email) = LOWER('${req.body.email}')`, (err, results) => {
        try{
            if(results && results.length){
                return res.status(409).send({message: 'อีเมลล์นี้มีผู้ใช้แล้ว'});
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).send({message: "ระบบล้มเหลวกรุณาติดต่อผู้ดูแลระบบ"});
                    }else{
                        conn.execute(`INSERT INTO users (email, password, fname, lname, phone, addr, uuid) VALUES (${conn.escape(req.body.email)}, '${hash}', '${req.body.fname}', '${req.body.lname}', '${req.body.phone}','${req.body.address}', '${uuidv4()}')`, (err, results) => {
                            if(err){
                                return res.status(400).send({message: "ระบบล้มเหลวกรุณาติดต่อผู้ดูแลระบบ"});
                            }
                            conn.execute(`SELECT * FROM users WHERE LOWER(email) = LOWER('${req.body.email}')`, (err, results1) =>{
                                if(err){
                                    return res.status(400).send({message: "ระบบล้มเหลวกรุณาติดต่อผู้ดูแลระบบ"});
                                }
                                return res.status(201).send({
                                    message: "สมัครสมาชิกสำเร็จ!",
                                    status: 201
                                });
                            })
                        })
                    }
                })
            }

        }
        catch{
            return res.status(400).send({message: "ระบบผิดพลาดกรุณาลองใหม่อีกครั้ง"});
        }
    })
}

const login = (req, res, next)=>{
    conn.execute(`SELECT * FROM users WHERE email = ${conn.escape(req.body.email)}`, (err, results) =>{
        try{
            if(err){
                return res.status(400).send({message: "ระบบล้มเหลวกรุณาติดต่อผู้ดูแลระบบ"});
            }
            if(results[0]['status'] == 'ban'){
                return res.status(400).send({message: "อีเมลล์ผู้ใช้ถูกระงับการใช้งาน"});
            }
            if(results[0]['status'] == 'unactivate'){
                return res.status(400).send({message: "อีเมลล์ผู้ใช้ไม่สามารถใช้งานได้กรุณาติดต่อผู้ดูแลระบบ"});
            }
            if(!results.length){
                return res.status(400).send({message: "อีเมลล์หรือรหัสผ่านที่ท่านกรอกผิด"});
            }
            bcrypt.compare(req.body.password, results[0]['password'], (bErr, bResults) =>{
                if(bErr){
                    return res.status(400).send({
                        message: "อีเมลล์หรือรหัสผิด"
                    })
                }
                if(bResults){
                    const token = jwt.sign({
                        email: results[0]['email'],
                        uuid: results[0]['uuid']
                    },
                    // "SECRETKEY",{expiresIn: "1d"});
                    "SECRETKEY",{expiresIn: "7d"});
                    conn.execute(`UPDATE users SET last_login = now() WHERE uuid = '${results[0].uuid}'`);
                    try{
                        return res.status(200).send({
                            message: "เข้าสู่ระบบสำเร็จ",
                            token,
                    })
                    }catch{
                        return res.status(400).send({message: "อีเมลล์หรือรหัสผ่านผิด"});
                    }

                }
                return res.status(400).send({message: "อีเมลล์หรือรหัสผ่านผิด"});
            })
        }
        catch{
            return res.status(400).send({message: "ระบบผิดพลาดกรุณาลองใหม่อีกครั้ง", status: 400});
        }

    })
}

const route = (req, res)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'SECRETKEY');

    conn.execute(`SELECT * FROM users WHERE uuid = '${req.userData.uuid}'`, (err, results) =>{
        if(err){
            return res.status(400).send({message: "ระบบผิดพลาดกรุณาลองใหม่อีกครั้ง"});
            // throw err
        }

        res.status(200).send({
            email: req.userData.email,
            data: req.userData,
            last_login: results[0]['last_login'],
            token
        })
    })
}

module.exports = {
    login,
    register,
    route
}
 