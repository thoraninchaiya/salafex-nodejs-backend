// import URL from '../../config';
var config = require('../config');
var conn = require('../connect');

//get category
const categroys = (req, res)=>{
    conn.execute(`SELECT * FROM category WHERE category_status = 'active'`, (error, results, fields)=>{
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
              id: results[i].category_id,
              cname: results[i].category_name,
              cnameeng: results[i].category_name_eng,
              detail: results[i].category_dtails
            //   test: config.mainUrl + config.imagePath
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        // res.end();
        // res.status(200).send({
        //     objs
        // })
    })
}

//get category
const categroy = (req, res)=>{
    // console.log(req)
    // console.log(req.params)
    conn.execute(`SELECT * FROM category a INNER JOIN product b ON a.category_id = b.category_id WHERE a.category_status = 'active' AND a.category_id = ${req.params.id} AND b.status = 'active'`, (cerr, cresults) => {
        try{
            if(cerr) throw cerr
            var objs = [];
            if(cresults == undefined || cresults.length == 0){
                console.log("Empty")
                res.status(400).send({
                    status: 400,
                    message: "Category Item Empty!"
                })
            }
            // console.log(cresults)
            for (var i = 0;i < cresults.length; i++) {
                objs.push({
                    secretid: cresults[i].secretid,
                    id: cresults[i].id,
                    name: cresults[i].name,
                    price: cresults[i].price,
                    detail: cresults[i].category_dtails,
                    image: config.mainUrl + config.imagePath + cresults[i].image
                });
            }
            res.status(200).send({
                results: objs,
            })
        }
        catch{
            return res.status(400).send({
                status: 404
            });
        }

    })
}

module.exports = {
    categroys,
    categroy
}