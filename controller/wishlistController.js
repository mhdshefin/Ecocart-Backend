import userModel from "../models/userModel.js";


const addToWishlist = async (req, res) => {

    try {
        const { itemId, userId } = req.body;

        const user = await userModel.findById(userId)
        let wishlist = user.wishlist || []

        if (!itemId || !userId) {
            return res.json({ success: false, message: "Invalid item or user ID" });
        }
        console.log(itemId);


        if (!wishlist.includes(itemId)) {
            wishlist.push(itemId)
        } else {
            wishlist = wishlist.filter((item) => item !== itemId)
        }

        const upuser = await userModel.findByIdAndUpdate(userId, { wishlist }, { new: true })
        console.log(upuser);
        res.json({ success: true, message: "Product added to wishlist" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const getWishlistProduct = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "Invalid user ID" });
        }
        const user = await userModel.findById(userId)

        const wishlistItems = user.toObject().wishlist;

        console.log(wishlistItems);

        res.json({ success: true, wishlistItems })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { addToWishlist, getWishlistProduct } 