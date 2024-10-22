const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
            },
            _id: false,
        },      
    ],
})
exports.Cart = mongoose.model('Cart', cartSchema)
