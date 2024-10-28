const { Category } = require('../models/category')
const express = require('express')
const router = express.Router()

// get all category 
router.get(`/getAll`, async (req, res) => {
    try {
        const category_list = await Category.find()
        if (!category_list) 
            res.statusCode(404).json({ success: false, message: 'Category not found' })
        res.status(200).json(category_list)
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'})
    }
})

// get category by id
router.get(`/:id`, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (category.length === 0)
            res.status(404).json({
                message: 'The category with the given ID was not found',
            })
        res.status(200).send(category)
    } catch (error) {
        res.status(500).send({message: 'Error get category by id', error})
    }
})

// update category
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        {
            new: true,
        },
    )
    if (!category) return res.status(404).send('the category cannot be update!')
    res.send(category)
})

// add category
router.post(`/`, async (req, res) => {
    let category = Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })

    category = await category.save()
    if (!category)
        return res.status(404).send('the category cannot be created!')
    res.send(category)
})

// delete by id
router.delete('/:_id', (req, res) => {
    Category.findOneAndDelete(req.params.id)
        .then((category) => {
            if (category)
                return res
                    .status(200)
                    .json({ success: true, message: 'The category is delete!' })
            else
                return res
                    .status(404)
                    .json({ success: false, message: 'Category is not found!' })
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err })
        })
})

module.exports = router
