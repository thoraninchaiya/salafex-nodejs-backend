const express = require('express');
const cors = require('cors')
const app = express();
const port = 8080;
var path = require('path');
const userMiddleware = require('./middleware/user');
// const mysql = require('mysql2');
const bodyParser = require('body-parser');
const uproduct = require('./controller/user/product');
const aproduct = require('./controller/admin/product');
const carousel = require('./controller/carousel');
const userauth = require('./controller/user/auth');
const product = require('./controller/product/product');
const getprofile = require('./controller/user/profile');
var conn = require('./connect');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())
app.use(express.static(path.join(__dirname, 'store')));

// app.use(cors({
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Access-Control-Allow-Headers'
// }));

app.use(express.static('store/image/product'))

app.use('/img/product', express.static(path.join(__dirname, 'store/image/product')))
app.use('/img/carousel', express.static(path.join(__dirname, 'store/image/carousel')))

// homepage route
app.get('/', (req, res) => {
  res.send({
      error: false,
      message: 'SALAFEX BACK ENED',
      written_by: 'Thoranin',
      published_on: 'https://thoranin.org'
    })
})

//get carousel
app.get('/getcarousel', carousel.getcarousel)

//user
app.get('/category', uproduct.getcategory)
app.get('/products', uproduct.getproducts)
app.get('/registeringproducts', uproduct.getregisteringproducts)
app.get('/newproduct', uproduct.getnewproduct)
app.get('/user/profile', userMiddleware.isLoggedIn, getprofile.profile)
// app.post('/user/profile', getprofile.profile)

//user auth
app.post('/auth/login', userauth.login)
app.post('/auth/register', userMiddleware.validateRegister, userauth.register)
app.get('/auth/route', userMiddleware.isLoggedIn, userauth.route)

//admin
app.get('/admin/product/get', aproduct.getproduct)
app.post('/admin/product/add', aproduct.addproduct)
app.post('/admin/product/edit', aproduct.editproduct)
app.post('/admin/product/del', aproduct.delproduct)

//buy product
app.post('/buyproduct', userMiddleware.isLoggedIn, product.buyproduct)


//get product
app.get('/testproduct', (req, res) =>{
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