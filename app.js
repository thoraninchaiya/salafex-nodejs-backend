const express = require('express');
const cors = require('cors')
const app = express();
const port = 8080;
var path = require('path');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors())

app.use(express.static('store/image/product'))

app.use('/img/product', express.static(path.join(__dirname, 'store/image/product')))
app.use('/img/carousel', express.static(path.join(__dirname, 'store/image/carousel')))


//router
const carousel = require('./router/view/carousel'); //carousel
const product = require('./router/view/product'); //product
const category = require('./router/view/category'); //category
const cart = require('./router/user/cart'); //cart
const user = require('./router/user/user'); //cuser

//router use
app.use('/carousel', carousel)
app.use('/product', product)
app.use('/category', category)
app.use('/cart', cart)
app.use('/user', user)


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