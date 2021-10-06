const express = require('express');
const cors = require('cors')
const app = express();
const port = 8080;
var path = require('path');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors())
// response.headers("Content-Type", "application/json");

app.use(express.static('store/image/product'))

app.use('/img/product', express.static(path.join(__dirname, 'store/image/product')))
app.use('/img/carousel', express.static(path.join(__dirname, 'store/image/carousel')))


//router
const carousel = require('./router/view/carousel'); //carousel
const product = require('./router/view/product'); //product
const category = require('./router/view/category'); //category
const purchase = require('./router/view/purchase'); //category
const cart = require('./router/user/cart'); //cart
const user = require('./router/user/user'); //cuser

//router use
app.use('/carousel', carousel)
app.use('/product', product)
app.use('/category', category)
app.use('/cart', cart)
app.use('/user', user)
app.use('/purchase', purchase)


//admin router
const adminproduct = require('./router/admin/product'); //admin product router
const adminuser = require('./router/admin/user'); //admin user router


//admin use
app.use('/admin/product', adminproduct) //admin product use
app.use('/admin/user', adminuser) //admin user use



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