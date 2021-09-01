var conn = require('../../connect');



// add cart

const addcart = (req, res) => {
    console.log(req.userData);
    conn.query(`SELECT * FROM users WHERE uuid = '${req.userData.uuid}'`, (err, results) =>{
        if(err){
            throw err
        }

        res.status(200).send({
            email: req.userData.email,
            data: req.userData,
            last_login: results[0]['last_login'],
        })
    })
}


// const test = ['cat','dog','wolf']
// test.forEach(element => {
//     console.log(element)
// })


module.exports = {
    addcart
}