import { applianceModel, electronicModel, fashionModel, furnitureModel } from "../models/productModel.js";
import userModel from "../models/userModel.js";

const fetchAllProducts = async () => {
    try {
        const fashionProducts = await fashionModel.find({});
        const electronicProducts = await electronicModel.find({});
        const furnitureProducts = await furnitureModel.find({});
        const applianceProducts = await applianceModel.find({});

        const allProducts = [
            ...electronicProducts,
            ...fashionProducts,
            ...furnitureProducts,
            ...applianceProducts
        ].filter((item) => item !== undefined && item.length !== 0);

        return allProducts;

    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

const isProductWithoutSize = async (itemId) => {   
    const allProducts = await fetchAllProducts()
    const product = await allProducts.find(p => p._id === itemId);
    return !product?.sizes;
};

const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        if (!size & !isProductWithoutSize(itemId)) {
            res.json({ success: false, message: "Select product size" })
            return;
        }

        const user = await userModel.findById(userId)
        const cartData = user.cartData || {}

        if (cartData[itemId]) {
            if (size) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1
                } else {
                    cartData[itemId][size] = 1
                }
            } else {
                cartData[itemId]["no_size"] = (cartData[itemId]["no_size"] || 0) + 1
            }
        } else {
            cartData[itemId] = {}
            if (size) {
                cartData[itemId][size] = 1;
            } else {
                cartData[itemId]["no_size"] = 1;
            }
        }
        await userModel.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Added to cart" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const updateCart = async (req, res) => {
    try {

        const { userId, itemId, size, quantity } = req.body
        const user = await userModel.findById(userId)
        const cartData = user.cartData || {}
        console.log(quantity);

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (quantity <= 0) {
            if (size) {
                console.log(size);
                
                if (cartData[itemId][size]) {
                    delete cartData[itemId][size];
                    if (Object.keys(cartData[itemId]).length <= 0) {
                        delete cartData[itemId];
                    }
                } else {
                    cartData[itemId][size] = quantity;
                }
            } else {
                if (cartData[itemId]["no_size"]) {
                    delete cartData[itemId]["no_size"];
                    if (Object.keys(cartData[itemId]).length <= 0) {
                        delete cartData[itemId];
                    }
                } else {
                    cartData[itemId]["no_size"] = quantity;
                }
            }
        }
        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true })
        res.json({ success: true, message: "cart updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const getCart = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId)
        const cartData = user.cartData

        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export {
    addToCart,
    updateCart,
    getCart
}