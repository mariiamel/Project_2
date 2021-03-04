const router = require('express').Router()
const db = require('../models')
const { default: axios } = require('axios')


//get route coffeeshops/:id
router.get('/:id', async (req, res) => {
    try {
        const coffeeshopApiUrl = `https://api.yelp.com/v3/businesses/${req.params.id}`
        const response = await axios.get(coffeeshopApiUrl)
        const coffeedhop = response.data

        res.render('coffeedhop/show', { coffeedhop: coffeedhop })
    } catch (err) {
        console.log(err)
    }
})




module.exports = router