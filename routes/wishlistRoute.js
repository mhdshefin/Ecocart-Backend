import express from 'express'
import { addToWishlist, getWishlistProduct } from '../controller/wishlistController.js'
import userAuth from '../middleware/userAuth.js'

const wishlistRouter = express.Router()

wishlistRouter.post('/add', userAuth, addToWishlist)
wishlistRouter.get('/get', userAuth, getWishlistProduct)

export default wishlistRouter