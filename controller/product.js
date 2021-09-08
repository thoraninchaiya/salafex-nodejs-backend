// import URL from '../../config';
var config = require('../config');
var conn = require('../connect');

const newproduct = (req, res)=>{
    conn.query(`SELECT * FROM product WHERE status = "active" ORDER BY secretid DESC LIMIT 6`, (error, results, fields)=>{
        if(error) throw error
        var objs = [];
        if (results === undefined || results.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูลในขณะนี้",
                status: 404
            });
        }
        for (var i = 0;i < results.length; i++) {
            objs.push({
              id: results[i].secretid,
              cid: results[i].category_id,
              pid: results[i].id,
              name: results[i].name,
              price: results[i].price,
              image: config.mainUrl + config.imagePath + results[i].image
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        res.end();
    })
}

//get product
const products = (req, res)=>{
    conn.query(`SELECT * FROM product WHERE status = "active" and registering = "false"`, (error, results, fields)=>{
        if(error) throw error;
        var objs = [];
        if (results === undefined || results.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูลในขณะนี้",
                status: 404
            });
        }
        for (var i = 0;i < results.length; i++) {
            objs.push({
              id: results[i].secretid,
              cid: results[i].category_id,
              pid: results[i].id,
              name: results[i].name,
              price: results[i].price,
              image: config.mainUrl + config.imagePath + results[i].image
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        res.end();
    })
}

//get product
const registeringproducts = (req, res)=>{
    conn.query(`SELECT * FROM product WHERE status = "active" and registering = "true"`, (error, results, fields)=>{
        if(error) throw error;
        var objs = [];
        if (results === undefined || results.length == 0){
            return res.status(400).send({
                message: "ไม่พบข้อมูลในขณะนี้",
                status: 404
            });
        }
        for (var i = 0;i < results.length; i++) {
            objs.push({
              id: results[i].secretid,
              cid: results[i].category_id,
              pid: results[i].id,
              name: results[i].name,
              price: results[i].price,
              image: config.mainUrl + config.imagePath + results[i].image
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        res.end();
    })
}

module.exports = {
    products,
    newproduct,
    registeringproducts
}