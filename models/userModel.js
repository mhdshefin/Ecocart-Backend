import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    profile: { type: String, default: "https://res.cloudinary.com/dx7ykn2sv/image/upload/v1738078836/cqotrovwi5goot0a2y2x.png" },
    wishlist: { type: Array, default: [] },
}, { minimize: false })

const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel 