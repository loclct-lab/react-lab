const { Cart } = require('../models/cart')
const express = require('express')
const router = express.Router()
// get user's cart by user id
router.get('/:userId', async (req, res) => {
    const { userId } = req.params
    try {
        const cart = await Cart.findById(userId).populate({
            path: 'products.productId',
            model: 'Product',
        })
        return res.status(200).json(cart)
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching cart' })
    }
})
// add to cart | create new if it not exist
router.post('/add', async (req, res) => {
    const userId = req.body.userId
    const productId = req.body.productId
    const quantity = req.body.quantity
    try {
        let cart = await Cart.findById(userId)
        if (!cart) {
            cart = new Cart({ _id: userId, products: [] })
        }
        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toHexString() === productId,
        )
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({
                productId,
                quantity,
            })
        }
        await cart.save()
        return res.status(200).json(cart)
    } catch (error) {
        return res.status(500).json({
            error: 'Error adding to cart',
        })
    }
})
// delete product from cart
router.delete('/delete/:userId/:productId', async (req, res) => {
    const userId = req.params.userId
    const productId = req.params.productId
    try {
        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findById(userId)

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        // Lọc sản phẩm cần xóa khỏi mảng products
        cart.products = cart.products.filter(
            (item) => item.productId._id.toHexString() !== productId,
        )

        // Lưu giỏ hàng đã được cập nhật
        await cart.save()

        // Trả về giỏ hàng đã được cập nhật
        return res.status(200).json(cart)
    } catch (error) {
        return res.status(500).json({
            error: 'Error removing product from cart',
        })
    }
})
// increase product quantity
router.put('/increase', async (req, res) => {
    const userId = req.body.userId
    const productId = req.body.productId

    try {
        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findById(userId)

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng hay không
        const existingProduct = cart.products.find(
            (item) => item.productId.toString() === productId,
        )

        if (existingProduct) {
            // Tăng số lượng sản phẩm
            existingProduct.quantity += 1

            // Lưu giỏ hàng đã được cập nhật
            await cart.save()

            return res.status(200).json(cart)
        } else {
            return res.status(404).json({ error: 'Product not found in cart' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: 'Error increasing quantity',
        })
    }
})
// decrease product quantity
router.put('/decrease', async (req, res) => {
    const userId = req.body.userId
    const productId = req.body.productId

    try {
        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findById(userId)

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng hay không
        const existingProduct = cart.products.find(
            (item) => item.productId.toString() === productId,
        )

        if (existingProduct && existingProduct.quantity > 1) {
            // Tăng số lượng sản phẩm
            existingProduct.quantity -= 1

            // Lưu giỏ hàng đã được cập nhật
            await cart.save()

            return res.status(200).json(cart)
        } else {
            return res.status(404).json({ error: 'Product not found in cart' })
        }
    } catch (error) {
        return res.status(500).json({
            error: 'Error increasing quantity',
        })
    }
})
// delete many product from cart
router.post('/delete/:userId', async (req, res) => {
    const userId = req.params.userId
    const productIds = req.body // Danh sách ID sản phẩm cần xóa
    console.log(userId)
    try {
        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findById(userId)

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }
        // Lọc sản phẩm cần xóa khỏi mảng products
        cart.products = cart.products.filter(
            (item) => !productIds.includes(item.productId._id.toHexString()),
        )
        await cart.save()

        // Trả về giỏ hàng đã được cập nhật
        return res.status(200).json(cart)
    } catch (error) {
        return res.status(500).json({
            error: 'Error removing products from cart',
        })
    }
})

// remove all cart
router.delete('/delete/all', async (req, res) => {
    try {
        await Cart.deleteMany()
        res.status(204).json({
            success: true,
            message: 'Delete all product success!',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error' })
    }
})
module.exports = router
