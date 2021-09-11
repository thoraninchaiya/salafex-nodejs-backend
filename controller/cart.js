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
            conn.execute(`SELECT * FROM cart LEFT JOIN product ON cart.product_id = product.id WHERE users_id = '${userresults[0]['id']}'`, (err, cartresult) => {
                var objs = [];
                try{
                    if(err){
                        return res.status(400).send({
                            message: "กรุณาติดต่อผู้ดูแลระบบ",
                            status: 400
                        })
                    }
                    if(cartresult === undefined || cartresult.length == 0){
                        return res.status(400).send({
                            message: "ไม่มีสินค้าในตะกร้าสินค้า",
                            status: 400
                        })
                    }
                    for (var i = 0;i < cartresult.length; i++){
                        objs.push({
                            cid: cartresult[i]['cart_id'],
                            id: cartresult[i]['secretid'],
                            image: config.mainUrl + config.imagePath + cartresult[i].image,
                            name: cartresult[i]['name'],
                            price: cartresult[i]['price'],
                            qty: cartresult[i]['cart_qty'],
                        });
                    }
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(objs));
                    res.end();
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
    // console.log(req.body)
    // console.log(req.userDataInfo)
    conn.execute(`select * from product where id = '${req.body.pid}' and status = 'active'`, (err, productresults) =>{
        if(err){
            throw(err)
        }
        if(productresults === undefined || productresults.length == 0){
            return res.status(400).send({
                message: "ไม่พบสินค้า",
                status: 400
            })
        }
        conn.execute(`select * from cart where cart_status = 'pending' and product_id = '${req.body.pid}'`, (err, cartcheckstatus) => {
            try{
                if(cartcheckstatus === undefined || cartcheckstatus.length == 0){
                    conn.execute(`INSERT INTO cart(users_id, product_id, cart_qty) VALUES (${req.userDataInfo.id}, '${productresults[0]['id']}', ${req.body.qty})`, (err, cartinsertresults) => {
                        try{
                            if(err){
                                console.log(err)
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
                    conn.execute(`update cart set cart_qty = cart_qty + ${req.body.qty} where product_id = '${productresults[0]['id']}' and cart_status = 'pending'`, (updateerr, updateproductstatus) => {
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
                    message: "ระบบผิดพลาด 1",
                    status: 400
                })
            }
        })
    })
}

//update cart
const updatecart = (req, res) => {

}


//remove cart
const removecart = (req, res) => {
    
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