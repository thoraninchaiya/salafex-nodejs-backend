var conn = require('../../connect');
var config = require('../../config');

function checkadmin(req, res, next){
    // console.log(req.userData.uuid)
    conn.execute(`SELECT * FROM users WHERE uuid = '${req.userData.uuid}' AND role = 'admin' AND status = 'activate'`, (checkerr, checkresults) => {
        if(checkerr) throw checkerr
        // console.log(checkresults)
        if(checkresults === undefined || checkresults.length == 0){
            return res.status(400).send({
                status: 400
            });
        }
        const admindata = {
            id: checkresults[0].id,
            uuid: checkresults[0].uuid,
        }
        req.adminData = admindata;
        next();
    })
}

module.exports = {
    checkadmin
}