import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import ProductRouter from './routes/productRoute.js'
import userRoter from './routes/userRoute.js'
import cartRouter from './routes/cartRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import orderRouter from './routes/orderRoute.js'

const app = express()
const port = 4000

connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/api/product', ProductRouter)
app.use('/api/user', userRoter)
app.use('/api/cart', cartRouter)
app.use('/api/wishlist',wishlistRouter)
app.use('/api/order',orderRouter)

app.get('/', (req, res) => {
    res.send('API working')
})

app.listen(port, () => {
    console.log('server started on port:', port);
})