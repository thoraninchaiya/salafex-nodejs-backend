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
                            cid: cartresult[i].cid,
                            id: cartresult[i].secretid,
                            image: config.mainUrl + config.imagePath + cartresult[i].image,
                            name: cartresult[i]['name'],
                            price: cartresult[i]['price'],
                            qty: cartresult[i]['cqty'],
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
    // console.log(req)
    // conn.execute(`select * from product`, (err, results) =>{
    //     if(err){
    //         throw err
    //     }
    //     return res.status(200).send({
    //         product: results
    //     })
    // })
    if(!req.body.name){
        return res.status(400).send({
            message: "กรุณาติดต่อผู้ดูแลระบบ",
            status: 400
        })
    }
    return res.status(200).send({
        message: "success",
        userdata: req.userData,
        body: req.body
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