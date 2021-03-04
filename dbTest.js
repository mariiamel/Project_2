const db = require('./models');

const coffeshopCreateTest = async () => {
    const newCoffeshop = await db.coffeshop.create({
    name: 'Starbucks'
})
    console.log('Created: ', newCoffeshop.name)
}
// coffeshopCreateTest()

const coffeshopFindTest = async () => {
    const foundCoffeshop = await db.coffeshop.findOne({
        where: {
            name: 'Starbucks'
          }
})
    console.log('Found: ', foundCoffeshop.name)
}
// coffeshopFindTest()

