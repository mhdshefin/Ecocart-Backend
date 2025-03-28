import express from 'express'
import { addProduct, addRatings, getAllProducts, listProducts, removeProduct } from '../controller/productControllers.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'
import userAuth from '../middleware/userAuth.js'

const ProductRouter = express.Router()


ProductRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct)
ProductRouter.post('/remove', adminAuth, removeProduct)
ProductRouter.post('/list', listProducts)
ProductRouter.get("/allproduct", getAllProducts)
ProductRouter.post('/ratings', upload.fields([{ name: 'image', maxCount: 1 }]), userAuth, addRatings)


export default ProductRouter