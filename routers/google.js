const { User } = require('../models/user')
const express = require('express')
const bcrypt = require('bcryptjs')
const router = require('express').Router()

router.post('/signin', async (req, res) => {
    console.log(req.body)
    if (req.body.email === undefined)
        return res.status(400).send({ message: 'The user do not created!' })

    let gender
    switch (req.body.gender) {
        case 0:
            gender = 'Female'
            break
        case 1:
            gender = 'Male'
            break
        case 2:
        default:
            gender = 'Other'
    }
    let user = await User.findOne({ email: req.body.email }).select(
        '-password_hash',
    )
    if (!user) {
        // User not found, not have account in database
        // => REGISTER ACCOUNT
        let newUser = new User(
            {
                _id: req.body._id,
                name: req.body.name,
                gender: gender,
                email: req.body.email,
                password_hash: bcrypt.hashSync('' + req.body.id, 10),
                phone: req.body.phonenumber,
                is_admin: false,
                avatar: req.body.picture,
            },
            {
                new: true,
            },
        )
        user = await newUser.save()
        if (!user) return res.status(400).send('The user do not created!')
        res.send(user)
    } else {
        res.send(user)
    }
})
module.exports = router
