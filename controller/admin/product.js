var conn = require('../../connect');
var config = require('../../config');

const getproduct = (req, res)=>{
    // var sqlget = `SELECT * FROM product`;
    // var sqlsearch = `SELECT * FORM product WHERE id = ?`;
    // var params = [req.params.id];
    conn.execute(`SELECT * FROM product`,(geterr, getresults)=>{
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
                secretid: getresults[i]['secretid'],
                product_id: getresults[i]['id'],
                category_id: getresults[i]['category_id'],
                product_name: getresults[i]['name'],
                product_price: getresults[i]['price'],
                product_qty: getresults[i]['product_qty'],
                sold_qty: getresults[i]['sold_qty'],
                product_status: getresults[i]['status'],
                product_image: config.mainUrl + config.imagePath + getresults[i].image,
            })
        }
        return res.status(200).send(objs);
    })
}

const addproduct = (req, res)=>{
    conn.execute(`SELECT * FROM product WHERE id = '${req.body.productid}'`,(selecterr, selectresults) => {
        if(selecterr) throw err
        console.log(selectresults)
        // if(selectresults){
        //     res.status()
        // }
    })
}

const editproduct = (req, res)=>{
    if(req.body.type === 'updatestatus'){
        conn.execute(`UPDATE product set status = '${req.body.status}' where id = '${req.body.id}'`,(updateerr , updateresult)=>{
            try{
                if(updateerr) throw updateerr
                return res.status(200).send({
                    status: 200,
                    message: "อัพเดตข้อมูลสำเร็จ"
                })
            }catch{
                return res.status(400).send({
                    status: 400,
                    message: "ระบบผิดพลาด"
                })
            }
        })
    }
    if(req.body.type === 'updateproduct'){
        
    }
    else{
        return res.status(400).send({
            status: 400,
            message: "ผิดพลาด"
        })
    }
}

const delproduct = (req, res)=>{
    
}

module.exports = {
    getproduct,
    addproduct,
    editproduct,
    delproduct
}