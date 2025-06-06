const express=require('express');
const router=express.Router();
const cartController=require('../controller/cartController')
// const authMiddleware=require('../Middlewares/authMiddleware')

router.post('/addtocart',cartController.addToCart)
router.get('/getallcart/:userId',cartController.getCart)
router.put('/update/:cartId',cartController.updateCart)
router.delete('/remove/:cartId',cartController.removeCartItem)

module.exports=router;