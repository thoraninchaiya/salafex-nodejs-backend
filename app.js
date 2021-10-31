const express = require('express');
const cors = require('cors')
const app = express();
const port = 8080;
const util = require('util')
var path = require('path');
var fileupload = require('express-fileupload')
const bodyParser = require('body-parser');
const fs = require('fs')
app.use(express.json());
app.use(cors())
app.use(fileupload())

app.use('/img/product', express.static(path.join(__dirname, 'store/image/product')))
app.use('/img/carousel', express.static(path.join(__dirname, 'store/image/carousel')))


//router
const carousel = require('./router/view/carousel'); //carousel
const product = require('./router/view/product'); //product
const category = require('./router/view/category'); //category
const purchase = require('./router/view/purchase'); //category
const cart = require('./router/user/cart'); //cart
const user = require('./router/user/user'); //cuser
const comment = require('./router/view/comment');
const delivery = require('./router/user/delivery');

//router use
app.use('/carousel', carousel)
app.use('/product', product)
app.use('/category', category)
app.use('/cart', cart)
app.use('/user', user)
app.use('/purchase', purchase)
app.use('/comment', comment)
app.use('/delivery', delivery)

//admin router
const adminproduct = require('./router/admin/product'); //admin product router
const adminuser = require('./router/admin/user'); //admin user router
const adminpurchase = require('./router/admin/purchase'); //admin purchase router
const admindashboard = require('./router/admin/dashboard'); //admin purchase router
const banner = require('./router/admin/banner'); //admin banner
const registering = require('./router/admin/registering'); //admin registering

//admin use
app.use('/admin/product', adminproduct) //admin product use
app.use('/admin/user', adminuser) //admin user use
app.use('/admin/purchase', adminpurchase) //admin purchase use
app.use('/admin/dashboard', admindashboard) //admin dashboard
app.use('/admin/banner', banner) //admin banner
app.use('/admin/registering', registering) //admin registering


//ขอรีเควสการดึงรูปโดยแอดมิน
app.use('/admin/img/payment', express.static(path.join(__dirname, 'store/receipt/payment')))


app.post('/test/upload', (req, res) => {
  console.log(req.files)
  const datapayment = req.body
  console.log(datapayment)

  // if(req.files){
  //   var file = req.files.file
  //   var fileanmemd5 = file.md5
  //   var type = file.mimetype
  //   var cuttype = type.split('/')

  //   file.mv('./store/upload/'+ fileanmemd5 + "." + cuttype[1], function(err){
  //     if(err){
  //       res.send(err)
  //     }else{
  //       res.send("file upload")
  //     }
  //   })
  // }
})

app.post('/test', (req, res)=>{
  console.log(req.body)
  console.log(req.files)
}) 

app.delete('/test', (req, res)=>{
  console.log(req.body)
  res.status(200).send({
    status: 200,
    body: req.body
  })
})


// const userdata = require('./controller/user/user');


// app.use(cors({
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Access-Control-Allow-Headers'
// }));

// homepage route
app.get('/', (req, res) => {
  res.send({
      error: false,
      message: 'SALAFEX BACK ENED',
      written_by: 'Thoranin',
      published_on: 'https://thoranin.org'
    })
})

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})

module.exports = app;