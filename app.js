const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.options('*', cors())
require('dotenv/config')

// middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000') // Replace with your domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
})


// Routers
const category_router = require('./routers/categories')
const product_router = require('./routers/products')
const order_router = require('./routers/orders')
const user_router = require('./routers/users')
const cartRouter = require('./routers/carts')
const api = process.env.API_URL

app.use(`${api}/categories`, category_router)
app.use(`${api}/products`, product_router)
app.use(`${api}/orders`, order_router)
app.use(`${api}/users`, user_router)
app.use(`${api}/carts`, cartRouter)

// mongodb connect
mongoose
    .connect(process.env.CONNECTION_STRING, {
        dbName: 'ecommerce',
    })
    .then(() => {
        console.log('Database connection is ready')
    })
    .catch((err) => {
        console.log(err)
    })

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(
        'Server in running on port',
        port,
        
    )
})
