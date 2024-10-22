const express = require('express')
const { Chat } = require('../models/chat')
const router = express.Router()

router.post('/', async (req, res) => {
    console.log(req.body)
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId],
    })
    try {
        const result = await newChat.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.get('/:userId', async (req, res) => {
    try {
        const chat = await Chat.find({ members: { $in: [req.params.userId] } })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.get('/find/:firstId/:secondId', async (req, res) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        })
        res.status(200).json(chat)
    } catch (error) {}
})

module.exports = router
