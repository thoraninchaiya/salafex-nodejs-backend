// import URL from '../../config';
var config = require('../config');
var conn = require('../connect');

//get category
const categroys = (req, res)=>{
    conn.execute(`SELECT * FROM category`, (error, results, fields)=>{
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
              id: results[i].id,
              cname: results[i].name,
              cnameeng: results[i].name_eng,
              test: config.mainUrl + config.imagePath
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        res.end();
    })
}

//get category
const categroy = (req, res)=>{

}

module.exports = {
    categroys,
    categroy
}