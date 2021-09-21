const express = require('express');
const router = express.Router();
const user = require('../models/user.model');

router.get('/users.json', (req, res, next) => {
    user.find({}).then(function (users) {
        res.send(users)
    }).catch(next)
})

router.post('/users', async (req, res, next) => {
    try{
        const foundUser = await user.findOne({ 'email': req.body.email })
        res.status(200).json(foundUser)
        }catch (err) {
            res.status(500).json({message:err})
        }
})

module.exports =router