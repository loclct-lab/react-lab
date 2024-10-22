const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()

router.get('/login', async (req, res) => {
    // const infor = {
    //     username: process.env.goship_username,
    //     password: process.env.goship_password,
    //     client_id: process.env.goship_client_id,
    //     client_secret: process.env.goship_client_secret,
    // }

    // try {
    //     const token = await axios.post(
    //         'https://sandbox.goship.io/api/v2/login',
    //         infor,
    //     )
    //     if (token.state === 200) {
    //         console.log(token.data?.access_token)
    //         res.status(200).json(token.data?.access_token)
    //     }
    // } catch (error) {
    //     res.status(500).json(error)
    // }
    const goshipToken = process.env.goship_token
    res.status(200).json(goshipToken)
})
router.post('/cities', async (req, res) => {
    const token = req.body.token
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }
    try {
        const cities = await axios.get(
            'http://sandbox.goship.io/api/v2/cities',
            config,
        )
        if (cities.status === 200) res.status(200).json(cities.data)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.post('/districts', async (req, res) => {
    const cityCode = req.body.cityCode
    const token = req.body.token
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }
    try {
        const districts = await axios.get(
            `http://sandbox.goship.io/api/v2/cities/${cityCode}/districts`,
            config,
        )
        if (districts.status === 200) res.status(200).json(districts.data)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.post('/rates', async (req, res) => {
    const token = req.body.token
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }
    const infor = {
        shipment: {
            address_from: req.body.from,
            address_to: req.body.to,
            parcel: req.body.parcel,
        },
    }
    try {
        const responsed = await axios.post(
            'http://sandbox.goship.io/api/v2/rates',
            infor,
            config,
        )
        if (responsed.status == 200) {
            res.status(200).json(responsed.data)
        }
    } catch (e) {
        res.status(500).json(e)
    }
})

module.exports = router
