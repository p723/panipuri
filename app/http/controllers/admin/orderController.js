const order = require("../../../models/order")

function orderController() {
         return {
                  index(req, res) {
                          const Orders = order.find({ status: { $ne: 'completed' } }, null,{ sort: { 'createdAt': -1}})
                          .populate('customerId', '-password').exec((err, result) => {
                                    if(err){
                                           return res.send(err)
                                    }
                                    if (req.xhr) {
                                             return res.json(result)
                                    }else{
                                    return res.render('admin/orders')
                                    }
                           })
                  }
         }
}

module.exports = orderController