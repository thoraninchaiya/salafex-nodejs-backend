var conn = require('../../connect');
const { v4: uuidv4 } = require('uuid');

const profile = (req, res)=>{
    // console.log(req.userData);
    // console.log(req)
    // console.log("profile")
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
    profile
}