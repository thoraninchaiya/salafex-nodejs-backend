var config = require('../config');
var conn = require('../connect');

function add(req, res){
    if(!req.params.productid || !req.body.comment || !req.body.rating){
        return res.status(400).send({
            status: 400,
            message: "Error Methods"
        })
    }

    conn.execute(`SELECT * FROM product WHERE secretid = ${req.params.productid}`,(selproducterr, selproductresults) => {
        if(selproducterr) throw selproducterr

        if(selproductresults === undefined || selproductresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่พบสินค้า"
            })
        }

        conn.execute(`INSERT INTO comment(users_id, product_id, comment_detail, comment_rating) VALUES (${req.userDataInfo.id}, ${selproductresults[0]['secretid']}, '${req.body.comment}', ${req.body.rating})`,(inscommenterr, inscommentresults) => {
            if(inscommenterr) throw inscommenterr
            return res.status(200).send({
                status: 200,
                message: "แสดงความคิดเห็นสำเร็จ"
            })
        })
    })
}

function show(req, res) {
    var objs = []
    if(!req.params.productid){
        return res.status(400).send({
            status: 400,
            message: "Error Methods"
        })
    }
    conn.execute(`SELECT * FROM comment a INNER JOIN users b ON a.users_id = b.id WHERE product_id = ${req.params.productid}`, (selcomerr, selcomresults) => {
        if(selcomerr) throw selcomerr
        if(selcomresults === undefined || selcomresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่มีความคิดเห็น"
            })
        }
        
        for(var i = 0;i < selcomresults.length; i++){
            objs.push({
                commentid: selcomresults[i]['comment_id'],
                username: selcomresults[i]['fname'] + " " + selcomresults[i]['lname'],
                comment: selcomresults[i]['comment_detail'],
                rating: selcomresults[i]['comment_rating'],
            })
            if(i === 3){
                continue
            }
        }
        return res.status(200).send({
            comment: objs
        })
    })
}

module.exports = { 
    add,
    show
}