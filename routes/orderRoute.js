import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import userAuth from '../middleware/userAuth.js'
import { allOrders, placeOrder, placeOrderStripe, updateStatus, userOrders, verifyStripe } from '../controller/orderController.js' 

const orderRouter = express.Router()

orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

orderRouter.post('/place',userAuth,placeOrder)
orderRouter.post('/stripe',userAuth,placeOrderStripe)

orderRouter.post('/userorders',userAuth,userOrders)

orderRouter.post('/verify',userAuth,verifyStripe)                                          

export default orderRouter