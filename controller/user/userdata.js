var conn = require('../../connect');

function userdatainfo(req, res, next){
    conn.execute(`select * from users where uuid = '${req.userData.uuid}' and status = 'activate'`, (err, results)=>{
        try{
            if(err){
                return res.status(400).send({
                    status: 400
                })
            }
            if (results === undefined || results.length == 0){
                return res.status(400).send({
                    message: "ไม่พบข้อมูลในขณะนี้",
                    status: 404
                });
            }
            const userresults = {
                id: results[0]['id'],
                uuid: results[0]['uuid'],
                fname: results[0]['fname'],
                lname: results[0]['lname'],
                phone: results[0]['phone'],
                addr: results[0]['addr'],
            }
            req.userDataInfo = userresults;
            next();
        }
        catch{
            return res.status(400).send({
                status: 400
            })
        }
    })
}

module.exports = {
    userdatainfo
}