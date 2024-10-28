// Tạo, Lưu trữ API và nhập xuất giữa các file
const { Product } = require('../models/product')
const { Category } = require('../models/category')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')

        if (isValid) uploadError = null
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    },
})

const uploadOptions = multer({ storage: storage })

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid category')

    const file = req.file
    if (!file) return res.status(400).send('No image in the request!')

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    // Let, not const
    let product = new Product(
        {
            _id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            image: `${basePath}${fileName}`,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numberReviews: req.body.numberReviews,
            isBestSeller: req.body.isBestSeller,
        },
        {
            new: true,
        },
    )
    new_product = await product.save()
    if (!new_product)
        return res.status(500).send('The product cannot be created!')

    res.send(new_product)
})
// search product
router.get('/search', async (req, res) => {
    try {
        const { key } = req.query
        const results = await Product.find({
            $or: [
                { name: { $regex: key, $options: 'i' } },
                { description: { $regex: key, $options: 'i' } },
            ],
        })
        res.json(results)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
router.get(`/`, async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }
        res.send(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid product id!')
        }
        const product = await Product.findById(req.params.id).populate('category')
        if (product.length === 0) 
            return res.status(404).json({ success: false, message: 'Product not found' })
        res.send(product)
    } catch (error) {
        res.status(500).json({ message: 'Error when get product detail' })
    }
})

router.get('/category/:id', async (req, res) => {
    try {
        const id = req.params.id
        const products = await Product.find({ category: id })
        if (!products)
            return res
                .status(400)
                .json({ message: 'Not found products for this category' })
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error when get products' })
    }
})

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid product id!')
    }
    // check category before update
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid category')
    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numberReviews: req.body.numberReviews,
            isBestSeller: req.body.isBestSeller,
        },
        { new: true },
    )

    if (!product) return res.status(500).send('The product cannot be updated!')
    res.send(product)
})

router.delete('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid product id!')
    }
    Product.findOneAndDelete(req.params.id)
        .then((product) => {
            if (product)
                return res
                    .status(200)
                    .json({ success: true, message: 'The product is deleted!' })
            else
                return res
                    .status(404)
                    .json({ success: false, message: 'Product is not found!' })
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err })
        })
})

router.delete('/delete/all', async (req, res) => {
    try {
        // Xóa tất cả sản phẩm
        await Product.deleteMany({})
        res.status(204).json({
            success: true,
            message: 'Delete all product success!',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' })
    }
})

module.exports = router
