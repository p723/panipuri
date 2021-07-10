const order = require("../../../models/order")
const Order = require('../../../models/order')

function orderController() {
         return {
                  index(req, res) {
                          const orders = Order.find({
                                    status: {
                                             $ne: 'completed'
                                    }
                           }, null, {
                                    sort: {
                                             'createdAt': -1
                                    }}).populate({path:'users', match:{_id:'customerId'}}).exec((err, Orders) => {
                                    if(err){
                                             console.log(err)
                                    }
                                    if (req.xhr) {
                                             return res.json(Orders)
                                    }
                                    return res.render('admin/orders')
                           })
                  }
         }
}

module.exports = orderController