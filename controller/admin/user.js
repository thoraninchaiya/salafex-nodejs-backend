var conn = require('../../connect');
var config = require('../../config');

const getusers = (req, res)=>{
    conn.execute(`SELECT * FROM users`,(geterr, getresults)=>{
        // conn.execute(`SHOW COLUMNS FROM users LIKE 'role'`,(colerr, colresult)=>{
            // if(colerr) throw colerr
            // console.log(colresult[0]['Type'])
        
        var objs = [];
        if(geterr) throw geterr

        if (getresults === undefined || getresults.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูล",
                status: 404
            });
        }

        for(var i=0;i < getresults.length; i++){
            objs.push({
                id: getresults[i]['id'],
                uuid: getresults[i]['uuid'],
                email: getresults[i]['email'],
                firstname: getresults[i]['fname'],
                lastname: getresults[i]['lname'],
                phone: getresults[i]['phone'],
                address: getresults[i]['addr'], 
                status: getresults[i]['status'], 
                createat: getresults[i]['create_at'], 
                lastlogin: getresults[i]['last_login'],
                role: getresults[i]['role'],
            })
        }
        // console.log(colresult[0]['Type'])
        // var data = colresult[0]['Type']
        // var dataarray = data.substr(5)
        // var maxlength = dataarray.length
        // var dataarray1 = dataarray.substr(0,maxlength-1)
        // console.log(dataarray1)
        // var toarray = dataarray1.split("'")
        // console.log(toarray)
        // console.log()
        // console.log(colresult[0]['Type'])
        return res.status(200).send({
            users: objs,
        });
        // })
    })
}

module.exports = {
    getusers
}