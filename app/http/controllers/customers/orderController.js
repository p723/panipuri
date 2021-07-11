const Order = require('../../../models/order')
const moment = require('moment')

function orderController () {
         return {
                  async index(req, res) {
                           const order = await Order.find({
                                    customerId: req.user._id
                           }, null,
                                    {
                                             sort: {
                                                      'createdAt': -1
                                             }
                                    })
                           res.render('customers/orders', {
                                    orders: order, moment: moment
                           })
                  },
                  store(req, res) {
                           const {
                                    phone,
                                    address
                           } = req.body
                           if (!phone || !address) {
                                    req.flash('error', 'All fields are required')
                                    req.flash('phone', phone)
                                    req.flash('address', address)
                                    return res.redirect('/cart')
                           }
                           const order = new Order({
                                    customerId: req.user._id,
                                    items: req.session.cart.items,
                                    phone,
                                    address
                           })

                           order.save().then(result => {
                                    req.flash('success', 'Order placed')
                                    delete req.session.cart
                                    res.header('Cache-Control', 'no-store')
                                    return res.redirect('/customer/orders')
                           }).catch(err => {
                                    req.flash('error', 'Something went Wrong..!')
                                    return res.redirect('/cart')
                           })
                  },
                  async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
         }
}
module.exports = orderController