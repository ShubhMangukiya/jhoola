const express=require('express')
const router=express.Router();
const wishlistController=require('../controller/wishListController')
// const authMiddleware=require('../Middlewares/authMiddleware')

router.post('/addtowishlist',wishlistController.addToWishlist)
router.get('/getwishlist/:userId',wishlistController.getUserWishlist)
router.delete('/delete',wishlistController.removeFromWishlist)

module.exports=router;