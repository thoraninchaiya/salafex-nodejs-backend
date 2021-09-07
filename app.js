const express = require('express');
const cors = require('cors')
const app = express();
const port = 8080;
var path = require('path');
const userMiddleware = require('./middleware/user');
const bodyParser = require('body-parser');


//router
const carousel = require('./router/view/carousel'); //carousel
const product = require('./router/view/product'); //product
const category = require('./router/view/category'); //category

//router use
app.use('/carousel', carousel)
app.use('/product', product)
app.use('/category', category)







// const aproduct = require('./controller/admin/product');
const userauth = require('./controller/user/auth');
const userdata = require('./controller/user/user');
const cart = require('./controller/cart');


app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

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
app.post('/auth/login', userauth.login)
app.post('/auth/register', userMiddleware.validateRegister, userauth.register)
app.get('/auth/route', userMiddleware.isLoggedIn, userauth.route)

//admin
// app.get('/admin/product/get', aproduct.getproduct)
// app.post('/admin/product/add', aproduct.addproduct)
// app.post('/admin/product/edit', aproduct.editproduct)
// app.post('/admin/product/del', aproduct.delproduct)

//cart
app.get('/getcart', userMiddleware.isLoggedIn, cart.getcart); //get cart
app.post('/addcart', userMiddleware.isLoggedIn, cart.addcart); //add cart
app.patch('/updatecart', userMiddleware.isLoggedIn, cart.updatecart); //update cart
app.post('/removecart', userMiddleware.isLoggedIn, cart.removecart); //remove cart

//buy product
// app.post('/buyproduct', userMiddleware.isLoggedIn, product.buyproduct)


app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})

module.exports = app;