const express = require('express');
const cors = require('cors')
const app = express();
// const port = 8080;

// const mysql = require('mysql2');
const bodyParser = require('body-parser');
const userproduct = require('./controller/user/product');
var conn = require('./connect');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

// homepage route
app.get('/', (req, res) => {
  res.send({
      error: false,
      message: 'SALAFEX BACK ENED',
      written_by: 'Thoranin',
      published_on: 'https://thoranin.org'
    })
})

app.get('/category', userproduct.getcategory)
app.get('/products', userproduct.getproducts)

//connection mysql db
// let dbCon = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '251242',
//     database: 'salafex'
// })
// dbCon.connect();



//get product
app.get('/product', (req, res) =>{
    // dbCon.query('SELECT qty FROM product where id="M101"', (error, results, fields)=>{
    //     if(error) throw error;
    //     let message = ""
    //     let type = (typeof results)
    //     if (results === undefined || results.length == 0){
    //         message = "Empty";
    //     }else{
    //         message = "Success";
    //     }

    //     return res.send({error: false, data: results, type: type, message: message});
    // })

    conn.query('SELECT * FROM product', (err, results, fields)=>{
        // let test = results.cost
        // let numtesttest = test
        // var a  = numtesttest.toString();
        // return res.send(a);

        // let test = results.name
        // let numtesttest = test
        // var a  = numtesttest.toString();
        // let type = (typeof test)
        // return res.send(type);

        // var count = results.length
        // var a  = count.toString();
        // let type = (typeof a)
        // res.send(a);

        var objs = [];
        for (var i = 0;i < results.length; i++) {
            objs.push({
              id: results[i].secretid,
              pid: results[i].id,
              name: results[i].name,
              price: results[i].price
            });
        }
        // res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(objs));
        res.end();
    })
})

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})

module.exports = app;