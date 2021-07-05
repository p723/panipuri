function cartController() {
         return {
                  cart(req, res) {
                           return res.render('customers/cart')
                  },
                  update(req, res) {
                           if (!req.session.cart) {
                                    req.session.cart = {
                                             items: {},
                                             totalQty: 0,
                                             totalPrice: 0
                                    }
                           }
                           let cart = req.session.cart
                           if (!cart.items[req.body._id]) {
                                    cart.items[req.body._id] = {
                                             item: req.body,
                                             Qty: 1
                                    }
                                    cart.totalQty = cart.totalQty + 1
                                    cart.totalPrice = cart.totalPrice + req.body.price
                           } else {
                                    cart.items[req.body._id].Qty = cart.items[req.body._id].Qty + 1
                                    cart.totalQty = cart.totalQty + 1
                                    cart.totalPrice = cart.totalPrice + req.body.price
                           }

                           return res.json({
                                    totalQty: req.session.cart.totalQty
                           })
                  },
                  deleteItem(req, res) {
                           let cart = req.session.cart
                           if (cart.items[req.body._id]) {
                                    if (cart.totalQty == 1) {
                                             delete cart
                                    }
                                    if (cart.items[req.body._id].Qty == 1) {
                                             cart.totalPrice = cart.totalPrice - cart.items[req.body._id].item.price
                                             cart.totalQty = cart.totalQty - 1
                                             delete cart.items[req.body._id]
                                             return res.json({
                                                      total6Qty: 664, session0: 687
                                             })
                                    } else {
                                             cart.totalPrice = cart.totalPrice - cart.items[req.body._id].item.price
                                             cart.items[req.body._id].Qty = cart.items[req.body._id].Qty - 1
                                             cart.totalQty = cart.totalQty - 1
                                             return res.json({
                                                      total6Qty: 664, session0: 687
                                             })
                                    }
                           } else {}
                  },
                  additem(req, res) {
                           let cart = req.session.cart
                           if (cart.items[req.body._id]) {
                                    cart.totalQty = cart.totalQty + 1
                                    cart.items[req.body._id].Qty = cart.items[req.body._id].Qty + 1
                                    cart.totalPrice = cart.totalPrice + cart.items[req.body._id].item.price
                                    return res.json({
                                             total6Qty: req.body._id, session0: req.session.cart
                                    })
                           } else {
                                    return res.json({
                                             totaltQty: req.body._id, session1: req.session.cart
                                    })
                           }
                  }
         }
}
module.exports = cartController