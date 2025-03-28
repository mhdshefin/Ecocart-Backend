import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await userModel.findOne({ email })

        if (existing) {
            res.json({ success: false, message: "User existing with same email" })
        }

        if (!password) {
            res.json({ success: false, message: "Please enter a password" })
        }
        if (password.length < 8) {
            res.json({ success: false, message: "Please enter a strong password" })
        }
        if (!validator.isEmail(email)) {
            res.json({ success: false, message: "Please enter a valid email" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email })

        if (!user) {
            res.json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: "Wrong password" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid email or password" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getUser = async (req, res) => {
    console.log("super");

    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "User Id must provide" })
        }

        const user = await userModel.findById(userId)
        res.json({ success: true, user })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateUserProfile = async (req, res) => {
    try {

        const { userId } = req.body;
        const file = req.files?.profileImage?.[0] || null;

        if (!userId || !file) {
            return res.json({ success: false, message: "No userId or Image" })
        }
        const imageUrl = await cloudinary.uploader.upload(file.path, { resource_type: 'image' })

        const user = await userModel.findByIdAndUpdate(userId, { $set: { profile: imageUrl.secure_url } }, { new: true });

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        } else {
            res.json({ success: true, user })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateUserName = async (req, res) => {
    try {
        const { userId, name } = req.body

        if (!userId || !name) {
            console.log("ooombi");
            return res.json({ success: false, message: 'No UserId or Name' })
        }

        const user = await userModel.findByIdAndUpdate(userId, { $set: { name: name } }, { new: true })
        res.json({ success: true, user })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    adminLogin,
    loginUser,
    registerUser,
    getUser,
    updateUserProfile,
    updateUserName
}