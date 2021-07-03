function cartController(){
        return {
                cart(req, res)  {
                      return res.render('customers/cart')
                }
        }
}
module.exports = cartController