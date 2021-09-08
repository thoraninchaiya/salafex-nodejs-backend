var config = require('../config');
var conn = require('../connect');

const getcarousel = (req, res)=>{
    conn.execute(`SELECT * FROM carousel where status = 'active'`, (error, results, fields)=>{
        if(error) throw error
        var objs = [];
        if (results === undefined || results.length == 0){
            return res.send("Empty");
        }
        for (var i = 0;i < results.length; i++) {
            objs.push({
              id: results[i].id,
              cname: results[i].name,
              image: config.mainUrl + config.imgCarousel + results[i].image
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        res.end();
    })
}

module.exports = {
    getcarousel
}