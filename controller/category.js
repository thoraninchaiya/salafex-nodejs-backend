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
    if(!req.params.id){
        return res.status(400).send({
            status: 400,
        })
    }

    conn.execute(`SELECT * FROM category WHERE category_status = 'active' AND category_id = ${req.params.id}`, (selcetegoryerr, selcetegoryresults) => {
        if(selcetegoryerr) throw selcetegoryerr
        if(selcetegoryresults == undefined || selcetegoryresults.length == 0){
            return res.status(400).send({
                status: 400,
                message: "ไม่มีหมวดหมู่นี้"
            })
        }
        var category = {
            categoryid: selcetegoryresults[0]['category_id'],
            categorythainame: selcetegoryresults[0]['category_name'],
            categoryengname: selcetegoryresults[0]['category_name_eng'],
            categorydtails: selcetegoryresults[0]['category_dtails'],
        }
        conn.execute(`SELECT * FROM category a INNER JOIN product b ON a.category_id = b.category_id WHERE a.category_status = 'active' AND a.category_id = ${req.params.id} AND b.status = 'active'`, (cerr, cresults) => {
            try{
                if(cerr) throw cerr
                var objs = [];
                if(cresults == undefined || cresults.length == 0){
                    return res.status(400).send({
                        status: 400,
                        message: "Category Item Empty!",
                        categorymain: category
                    })
                }
                for (var i = 0;i < cresults.length; i++) {
                    objs.push({
                        id: cresults[i].secretid,
                        name: cresults[i].name,
                        pid: cresults[i].id,
                        price: cresults[i].price,
                        pdetail: cresults[i].details,
                        image: config.mainUrl + config.imagePath + cresults[i].image,
                        onstock: true
                    });
                    if(i === 3){
                        continue;
                    }
                }
                return res.status(200).send({
                    status: 200,
                    results: objs,
                    categorymain: category,
                })
            }
            catch{
                return res.status(400).send({
                    status: 400
                });
            }

        })
    })
}

module.exports = {
    categroys,
    categroy
}