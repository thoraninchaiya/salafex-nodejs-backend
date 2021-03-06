var conn = require('../connect');
var config = require('../config');

const getcart = (req, res) => {
    conn.execute(`select * from users where uuid = '${req.userData.uuid}'`, (err, userresults) =>{
        try{
            if(err){
                return res.status(400).send({
                    message: "กรุณาติดต่อผู้ดูแลระบบ",
                    status: 400
                })
            }

            conn.execute(`SELECT * FROM cart LEFT JOIN product ON cart.product_id = product.secretid WHERE users_id = '${userresults[0]['id']}' and cart_status = 1 `, (err, cartresult) => {
                var objs = [];
                var total = [];
                try{
                    if(err){
                        return res.status(400).send({
                            message: "กรุณาติดต่อผู้ดูแลระบบ",
                            status: 400
                        })
                    }
                    if(cartresult === undefined || cartresult.length == 0){
                        return res.status(204).send({
                            message: "ไม่มีสินค้าในตะกร้าสินค้า",
                            status: 204
                        })
                    }
                    for (var i = 0;i < cartresult.length; i++){
                        objs.push({
                            cid: cartresult[i]['cart_id'],
                            id: cartresult[i]['secretid'],
                            productid: cartresult[i]['product_id'],
                            image: config.mainUrl + config.imagePath + cartresult[i].image,
                            name: cartresult[i]['name'],
                            price: cartresult[i]['price'],
                            qty: cartresult[i]['cart_qty'],
                        });
                    }
                    return res.status(200).send({
                        cart: objs
                    })
                }catch{
                    return res.status(400).send({
                        message: "กรุณาติดต่อผู้ดูแลระบบ",
                        status: 400
                    })
                }
            })
        }catch{
            return res.status(400).send({
                message: "กรุณาติดต่อผู้ดูแลระบบ",
                status: 400
            })
        }
    })
}

// add cart
const addcart = (req, res) => {
    conn.execute(`select * from product where secretid = '${req.body.sid}' and status = 'active'`, (err, productresults) =>{
        if(err){
            throw(err)
        }
        if(productresults === undefined || productresults.length == 0){
            return res.status(400).send({
                message: "ไม่พบสินค้า",
                status: 400
            })
        }
        conn.execute(`select * from cart where cart_status = 'pending' and product_id = '${req.body.sid}'`, (err, cartcheckstatus) => {
            try{
                if(cartcheckstatus === undefined || cartcheckstatus.length == 0){
                    conn.execute(`INSERT INTO cart(users_id, product_id, cart_qty) VALUES (${req.userDataInfo.id}, '${productresults[0]['secretid']}', ${req.body.qty})`, (err, cartinsertresults) => {
                        try{
                            if(err){
                                return res.status(400).send({
                                    message: "เกิดข้อผิดพลาด",
                                    status: 400
                                })
                            }
                            return res.status(200).send({
                                message: "เพิ่มสินค้าลงตะกร้าสำเร็จ",
                                status: 200
                            })
                        }catch{
                            return res.status(400).send({
                                message: "เกิดข้อผิดพลาด",
                                status: 400
                            })
                        }
                    })
                }else{
                    conn.execute(`update cart set cart_qty = cart_qty + ${req.body.qty} where product_id = ${productresults[0]['secretid']} and cart_status = 'pending'`, (updateerr, updateproductstatus) => {
                        if(updateerr){
                            return res.status(400).send({
                                message: "เกิดข้อผิดพลาด",
                                status: 400
                            })
                        }
                        return res.status(200).send({
                            message: "เพิ่มสินค้าลงตะกร้าสำเร็จ",
                            status: 200
                        })
                    })
                }
            }
            catch{
                return res.status(400).send({
                    message: "ระบบผิดพลาด",
                    status: 400
                })
            }
        })
    })
}

//update cart
const updatecart = (req, res) => {
    if(!req.body.status){
        return res.status(400).send({
            message: "เกิดขข้อมผิดพลาด",
            status: 400
        })
    }
    if(req.body.status == "add"){
        qtystate = '+1'
    }
    if(req.body.status == "minus"){
        qtystate = '-1'
    }
    conn.execute(`select * from product where secretid = '${req.body.productid}'`, (err, selectresults) => {
        if(err){
            // throw err
            return res.status(400).send({
                message: "ระบบผิดพลาด",
                status: 400
            })
        }
        if(selectresults === undefined || selectresults.length == 0){
            return res.status(400).send({
                message: "ไม่พบสินค้า",
                status: 400
            })
        }
        // console.log(selectresults)
        conn.execute(`update cart set cart_qty = cart_qty ${qtystate} where cart_id = ${req.body.cid} and product_id = '${selectresults[0]['secretid']}'`, (err, updatecartresults) => {
            if(err){
                throw err
            }

            conn.execute(`select * from cart where cart_id = ${req.body.cid}`, (err, selectresutlstodelete)=>{
                if(err){
                    throw err
                }
                if(selectresutlstodelete[0]['cart_qty'] === 0){
                    conn.execute(`delete from cart where cart_id = ${req.body.cid}`, (err, results) => {
                        if(err){
                            throw err
                        }
                    })
                }
            })
            return res.status(200).send({
                status: 200,
                message: "เพิ่มจำนวนสินค้าสำเร็จ"
            })
        })

        // conn.execute(`select * from cart where cart_id = ${req.body.cid}`, (err, selectallresults) =>{
        //     console.log(selectallresults[0]['cart_qty'])
        //     if(selectallresults[0]['cart_qty'] === 0){
        //         console.log("this")
        //     }
        // })
    })
}


//remove cart
const removecart = (req, res) => {
    conn.execute(`delete from cart where cart_id = ${req.body.cid}`, (err, results) => {

        if (err){
            // throw err
            return res.status(400).send({
                message: "ระบบผิดพลาด",
                status: 400
            })
        }
        try{
            return res.status(200).send({
                message: "ลบสินค้าสำเร็จ",
                status: 200
            })
        }
        catch{
            return res.status(400).send({
                message: "ระบบผิดพลาด",
                status: 400
            })
        }
    })
}

// const test = ['cat','dog','wolf']
// test.forEach(element => {
//     console.log(element)
// })



module.exports = {
    getcart,
    addcart,
    updatecart,
    removecart
}