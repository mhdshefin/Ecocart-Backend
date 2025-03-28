import orderModel from "../models/orderModel.js"
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.SRTIPE_SECRET_KEY)
const currency = 'inr'

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, type } = req.body

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }

        const newOrder = orderModel(orderData)
        await newOrder.save()

        if (type !== 'single') {
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
        }

        res.json({ success: true, message: "Order placed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address, type } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now()
        }


        const newOrder = orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round((item.price - (item.price * item.offer / 100)) * 100),
            },
            quantity: item.quantity
        }))

        let session

        if (type === 'single') {
            session = await stripe.checkout.sessions.create({
                success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&type=single&itemId=${items[0]._id}&size=${items[0].size}`,
                cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}&type=single&itemId=${items[0]._id}`,
                line_items,
                mode: 'payment'
            })

        } else {
            session = await stripe.checkout.sessions.create({
                success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&type=non-single`,
                cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}&type=non-single`,
                line_items,
                mode: 'payment'
            })

        }
        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error })
    }
}

const verifyStripe = async (req, res) => {
    const { userId, success, type, orderId, productId } = req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            if (type !== 'single') {
                await userModel.findByIdAndUpdate(userId, { cartData: {} })
                return res.json({ success: true, message: "order placed" })
            }
        } else {
            console.log("superrrrr");
            await orderModel.findByIdAndDelete(orderId)
        }
        res.json({ success: true, message: "Order placed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error })
    }
}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("userId", userId);

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Status updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, placeOrderStripe, verifyStripe, userOrders, allOrders, updateStatus }