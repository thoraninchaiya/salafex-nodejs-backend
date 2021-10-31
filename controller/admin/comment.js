var conn = require('../../connect');
var config = require('../../config');

function get(req, res) {
    // console.log(req.body)
    var objs = []
    conn.execute(`SELECT * FROM comment a INNER JOIN users b ON a.users_id = b.id WHERE product_id = ${req.body.product_id} AND comment_status = 1 ORDER BY comment_id DESC`,(err, results) => {
        if(err) throw err
        if(results === undefined || results.length == 0 ){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบข้อมูลการรีวิว"
            })
        }
        // console.log(results)
        for(var i=0;i < results.length; i++ ){
            objs.push({
                comment_id: results[i]['comment_id'],
                comment_detail: results[i]['comment_detail'],
                comment_rating: results[i]['comment_rating'],
                comment_date: results[i]['comment_datetime'],
                user: results[i]['fname'] + ' ' + results[i]['lname'], 
            })
        }
        return res.send({
            status: 200,
            message: "",
            data: objs,
            comment_count: results.length
        })
    })
}

function edit(req, res) {
    console.log(req.body)
}

function approve(req, res){
    // console.log(req.body)
    conn.execute(`UPDATE comment SET comment_status = 4 WHERE comment_id = ${req.body.comment_id}`,(updateerr, updateresults) =>{
        if(updateerr) throw updateerr
        return res.send({
            status: 200,
            message: "อนุมัติรีวิวสำเร็จ"
        })
    })
}
function cancelreview(req, res){
    // console.log(req.body)
    conn.execute(`UPDATE comment SET comment_status = 3 WHERE comment_id = ${req.body.comment_id}`,(updateerr, updateresults) =>{
        if(updateerr) throw updateerr
        return res.send({
            status: 200,
            message: "ยกเลิกรีวิวสำเร็จ"
        })
    })
}

module.exports = {
    get,
    edit,
    approve,
    cancelreview
}
