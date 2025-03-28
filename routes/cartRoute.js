import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { addToCart, getCart, updateCart } from '../controller/cartController.js'

const cartRouter = express.Router()

cartRouter.post('/add', userAuth, addToCart)
cartRouter.post('/update', userAuth, updateCart) 
cartRouter.get('/get', userAuth, getCart)

export default cartRouter