import { fashionModel, electronicModel, furnitureModel, applianceModel } from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary'

const addProduct = async (req, res) => {
    try {
        const productData = req.body;

        const productType = productData.section;

        console.log("reqq", req.body);

        if (!productData) {
            console.log('Product data is undefined or empty');
            return;
        }

        const parseJSON = (data) => {
            if (typeof data === "string") {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    return data;
                }
            }
            return data;
        };
        let model;

        switch (productType) {
            case "fashion":
                model = fashionModel;
                break;

            case "electronic":
                model = electronicModel;
                break;
            case "furniture":
                model = furnitureModel;
                break;
            case "speaker":
                model = speakerModel;
                break;
            case "appliance":
                model = applianceModel;
                break;

            default:
                res.json({ success: false, message: 'Enter a valid section' })
                break;
        }

        productData.size = parseJSON(productData.size);
        productData.colors = parseJSON(productData.colors);
        productData.highlights = parseJSON(productData.highlights);
        productData.generalDescription = parseJSON(productData.generalDescription);

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        const imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        productData.images = imageUrl;
        productData.date = Date.now()

        const product = new model(productData)
        await product.save()

        res.json({ success: true, message: 'Product added' })
        console.log("product added");


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const listProducts = async (req, res) => {
    try {
        const { productType } = req.body

        let model;
        let modelType = productType.toLowerCase()

        switch (modelType) {


            case "fashion":
                model = fashionModel;
                break;

            case "electronic":
            case "electronics":
                model = electronicModel;
                break;

            case "furniture":
                model = furnitureModel;
                break;

            case "speaker":
                model = speakerModel;
                break;

            case "appliance":
            case "appliances":
                model = applianceModel;
                break;
        }

        const products = await model.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const removeProduct = async (req, res) => {
    try {

        const { productType, productId } = req.body

        let model
        console.log(productType);

        const type = productType.toLowerCase();


        switch (type) {
            case "fashion":
                model = fashionModel;
                break;

            case "electronic":
            case "electronics":
                model = electronicModel;
                break;

            case "furniture":
                model = furnitureModel;
                break;

            case "speaker":
                model = speakerModel;
                break;

            case "appliance":
            case "appliances":
                model = applianceModel;
                break;

            default:
                res.json({ success: false, message: 'Enter a valid section' });
                break;
        }

        const product = await model.findByIdAndDelete(productId)
        res.json({ success: true, message: "Product deleted" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const getAllProducts = async (req, res) => {
    try {

        const fashionProducts = await fashionModel.find({})
        const electronicProducts = await electronicModel.find({})
        const furnitureProducts = await furnitureModel.find({})
        const applianceProducts = await applianceModel.find({})

        const allProducts = [
            ...electronicProducts,
            ...fashionProducts,
            ...furnitureProducts,
            ...applianceProducts
        ].filter((item) => item !== undefined && item.length !== 0)

        if (allProducts.length === 0) {
            return res.json({ success: false, message: "Couldn't fetch all products" })
        }
        if (allProducts.length > 0) {
            res.json({ success: true, allProducts })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const addRatings = async (req, res) => {
    try {
        const { productType, itemId, star, userId, userProfile, ratingText, description, userName } = req.body;

        console.log(productType, itemId, star, userId, userProfile, ratingText, description, userName);


        const file = req.files?.image ? req.files.image[0] : null;

        if (!star || !ratingText || !userName || !userProfile || !description) {
            return res.json({ success: false, message: "All required fields must be filled!" });
        }

        let model;
        let modelType = productType.toLowerCase()

        switch (modelType) {


            case "fashion":
                model = fashionModel;
                break;

            case "electronic":
            case "electronics":
                model = electronicModel;
                break;

            case "furniture":
                model = furnitureModel;
                break;

            case "speaker":
                model = speakerModel;
                break;

            case "appliance":
            case "appliances":
                model = applianceModel;
                break;
            default:
                return res.json({ success: false, message: 'Enter a valid section' });
        }

        if (!model) {
            return res.json({ success: false, message: "Section not found for the given product type" });
        }

        let imageUrl;

        if (file) {
            const uploadedImage = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
            imageUrl = uploadedImage.secure_url;
        }

        const product = await model.findById(itemId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const newratings = {
            rating: Number(star),
            userId: userId,
            userProfile: userProfile,
            userName: userName,
            ratingTitle: ratingText,
            description: description,
            image: imageUrl,
            createdAt: Date.now(),
        };

        if (!newratings.rating || !newratings.ratingTitle || !newratings.userName || !newratings.userProfile || !newratings.description) {
            return res.status(400).json({ success: false, message: "Missing required fields in rating" });
        }

        console.log(newratings);


        product.ratings.push(newratings);

        await product.save();

        res.json({ success: true, message: "Rating added successfully", product });

        console.log("Updated Product: ", product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, removeProduct, listProducts, getAllProducts, addRatings }