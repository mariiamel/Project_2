const router = require('express').Router()
const db = require('../models')
const { default: axios } = require('axios')
// const AES = require('crypto-js/aes')
const cryptoJS = require('crypto-js')


//show all favorite coffeeshops
router.get('/', async (req, res) => {
    if(!res.locals.user) {
        res.redirect('/auth/login')
    } else {
        try {
            const user = await db.user.findOne({
                where: { id: res.locals.user.id }, 
                include: db.coffeeshop
            })
            // console.log(user)
            res.render('coffeeshop/index', { coffeeshops: user.dataValues.coffeeshops } )
        } catch (err) {
            console.log(err)
        }
    }
})


//user can add coffeeshop to favorites
router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        let coffeeshop = await db.coffeeshop.findOne({
            where: {yelpId: req.body.yelpId}
        })
        if (!coffeeshop) {
            coffeeshop = await db.coffeeshop.create({
                name: req.body.name,
                img: req.body.img,
                yelpId: req.body.yelpId
            })
        }
        res.locals.user.addCoffeeshop(coffeeshop);
        res.redirect(`/coffeeshops`)
    } catch (err) {
        // console.log(err)
    }
})


//get route coffeeshops/:id (see details about one coffeeshop)
router.get('/:id', async (req, res) => {
    try {
        const config = {
            headers: {
              'Authorization': process.env.token
            }
        }
        const yelpId = req.query.yelpId
        const coffeeshopApiUrl = `https://api.yelp.com/v3/businesses/${yelpId}`
        const response = await axios.get(coffeeshopApiUrl, config)
        const coffeeshop = response.data
        console.log(coffeeshop)
        res.render('coffeeshop/show', { coffeeshop: coffeeshop })
    } catch (err) {
        console.log(err)
    }
})


// Delete coffeeshop from fav
router.delete('/:id', async (req, res) => {
    try{
        const coffeeshop = await db.coffeeshop.findByPk(req.params.id)
        const deletedCoffeeshop = await coffeeshop.destroy();
        const user = await db.user.findOne({
            where: { id: res.locals.user.id }, 
            include: db.coffeeshop
        })
        if (user.coffeeshops.length == 0) {
            res.redirect('/')
        } else{
            res.redirect('/coffeeshops');
        }
    }catch (err) {
        console.log(err)
    }
})


// Delete coffeeshop from fav
// router.delete('/:id', async (req, res) => {
//     try{
//         console.log(req.params)
//         const decryptedId = cryptoJS.AES.decrypt(res.locals.user.id, process.env.COOKIE_SECRET).toString(cryptoJS.enc.Utf8) 
//         const coffeeshop = await db.users_coffeeshop.destroy({
//             where: {
//                 coffeeshopId: req.params.id,
//                 userId: decryptedId
//             }
//         })
//         // const deletedCoffeeshop = await coffeeshop.destroy();
//         const user = await db.user.findOne({
//             where: { id: res.locals.user.id }, 
//             include: db.coffeeshop
//         })
//         if (user.coffeeshops.length == 0) {
//             res.redirect('/')
//         } else{
//             res.redirect('/coffeeshops');
//         }
//     }catch (err) {
//         console.log(err)
//     }
// })


// // Delete coffeeshop from fav
// router.delete('/:id', async (req, res) => {
//     try{
//         // const coffeeshop = await db.coffeeshop.findByPk(req.params.id)
//         // res.locals.user.removeCoffeeshop(coffeeshop)
//         const coffeeshop = await db.coffeeshop.findByPk(req.params.id)
//         const deletedCoffeeshop = await coffeeshop.destroy();
//         const user = await db.user.findOne({
//             where: { id: res.locals.user.id }, 
//             include: db.coffeeshop
//         })
//         if (user.coffeeshops.length == 0) {
//             res.redirect('/')
//         } else{
//             res.redirect('/coffeeshops');
//         }
//     }catch (err) {
//         console.log(err)
//     }
// })

// router.delete('/:id', async (req, res) => {
//     try {
//         const coffeeshop = await db.coffeeshop.findByPk(req.params.id)
//         res.locals.user.removeCoffeeshop(coffeeshop)
//         if (user.coffeeshops.length == 0) {
//     res.redirect('/')
// } else{
//     res.redirect('/coffeeshops');
// }
//     } catch(error) {
//         console.log(error)
//     }
// })


module.exports = router