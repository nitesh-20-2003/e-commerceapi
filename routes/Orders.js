const express=require('express');
const router=express.Router();
const {
    getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}=require('../constrollers/OrderControllers');
const {
    authenticatepayload,
    authorizePermissions
}=require('../middleware/authentication');
router.route('/')
.post(authenticatepayload,createOrder)
.get(authenticatepayload,authorizePermissions('admin'),getAllOrders);
router.route('/showAllMyOrders').get(authenticatepayload,getCurrentUserOrders)

router.route('/:id').get(authenticatepayload,getSingleOrder).patch(authenticatepayload,updateOrder);

module.exports=router;


