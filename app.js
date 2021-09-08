const express = require('express');
const cors = require('cors')
const app = express();
const port = 8080;
var path = require('path');
const userMiddleware = require('./middleware/user');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors())


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


const userdata = require('./controller/user/user');


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


//user
// app.get('/category', uproduct.getcategory)
app.get('/user/profile', userMiddleware.isLoggedIn, userdata.profile)
app.get('/user/info', userMiddleware.isLoggedIn, userdata.userinfo)
// app.post('/user/profile', getprofile.profile)

//user auth
// app.post('/auth/login', userauth.login)
// app.post('/auth/register', userMiddleware.validateRegister, userauth.register)
// app.get('/auth/route', userMiddleware.isLoggedIn, userauth.route)

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})

module.exports = app;