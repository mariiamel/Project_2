
/* Required Modules and Variables */
require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./models')
const ejsLayouts = require('express-ejs-layouts')
const rowdy = require('rowdy-logger')
const axios = require('axios')
const morgan = require('morgan')
const cryptoJS = require('crypto-js')
const rowdyRes = rowdy.begin(app)
const bcrypt = require('bcrypt')
const AES = require('crypto-js/aes')
const methodOverride = require('method-override')

/* Middleware and config */
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(require('cookie-parser')())
app.use(methodOverride('_method'))

// Adds the user to res.locals.user if there's a cookie
app.use(async (req, res, next) => {
    if (req.cookies.userId) {
        const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.COOKIE_SECRET).toString(cryptoJS.enc.Utf8)
        
        // console.log(decryptedId);
        // await db.user.findByPk(decryptedId)
        const user = await db.user.findOne({
            where: {
                id: decryptedId
            }
        })
        
        res.locals.user = user
    } else {
        res.locals.user = null
    }
    
    next()
})


/* Controllers */
app.use('/coffeeshops', require('./controllers/coffeeshopController'))
app.use('/auth', require('./controllers/authController'))


/* Routes */
app.get('/', async (req, res) => {
    try {
        res.render('index')
    } catch (err) {
        console.log(err)
    }
})


app.get('/search', async (req, res) => {
 try{
    const config = {
        headers: {
          'Authorization': process.env.token
        }
    }
    const YelpURL = 'https://api.yelp.com/v3/businesses/search?term=coffee_bakeries_coffeeshops&location=Seattle'
    const response = await axios.get(YelpURL, config)
    const coffeeshops = response.data.businesses
    // console.log(coffeeshops [0])
    res.render('coffeeshop/searchResults', { coffeeshops: coffeeshops })
 }catch(err) {
    console.log(err)
 }
}) 


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Hello server!');
  rowdyRes.print()
})