import mongoose, { Schema } from 'mongoose'

const ratingSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    userId: { type: String, required:true },
    userProfile: { type: String, required: true },
    userName: { type: String, required: true },
    ratingTitle: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now() },
});
    
const fashionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },      
    price: { type: Number, required: true },
    section: { type: String, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    ratings: { type: [ratingSchema], default: [] },
    offer: { type: Number, required: true }, 
    brand: { type: String, required: true },
    generalDescription: { type: Object, required: true },
    bestSeller: { type: Boolean, required: true },
    premium: { type: Boolean, required: true },
    highlights: { type: Array, required: true },
    itemCount: { type: Number, required: true },
    size: { type: [Schema.Types.Mixed], required: true },
    colors: { type: [String], required: true },
    date: { type: Number, required: true }
})

const furnitureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    section: { type: String, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    ratings: { type: [ratingSchema], default: [] },
    offer: { type: Number, required: true },
    brand: { type: String, required: true },
    generalDescription: { type: Object, required: true },
    bestSeller: { type: Boolean, required: true },
    premium: { type: Boolean, required: true },
    highlights: { type: Array, required: true },
    itemCount: { type: Number, required: true },
    color: { type: String, required: true },
    feature: { type: String, required: true },
    material: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Number, required: true }
})

const electronicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    section: { type: String, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    ratings: { type: [ratingSchema], default: [] },
    offer: { type: Number, required: true },
    brand: { type: String, required: true },
    generalDescription: { type: Object, required: true },
    bestSeller: { type: Boolean, required: true },
    premium: { type: Boolean, required: true },
    highlights: { type: Array, required: true },
    itemCount: { type: Number, required: true },
    operatingSystem: { type: String, required: true },
    ram: { type: String, required: true },
    internalStorage: { type: String, required: true },
    networkType: { type: String, required: true },
    processor: { type: String, required: true },
    date: { type: Number, required: true }
})

// const speakerSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     section: { type: String, required: true },
//     images: { type: Array, required: true },
//     category: { type: String, required: true },
//     subCategory: { type: String, required: true },
//     ratings: { type: [ratingSchema], default: [] },
//     offer: { type: Number, required: true },
//     brand: { type: String, required: true },
//     generalDescription: { type: Object, required: true },
//     bestSeller: { type: Boolean, required: true },
//     premium: { type: Boolean, required: true },
//     highlights: { type: Array, required: true },
//     itemCount: { type: Number, required: true },
//     connection: { type: String, required: true },
//     usage: { type: String, required: true },
//     date: { type: Number, required: true }
// })


const applianceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    section: { type: String, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },                            
    ratings: { type: [ratingSchema], default: [] },
    offer: { type: Number, required: true },
    brand: { type: String, required: true },
    generalDescription: { type: Object, required: true },
    bestSeller: { type: Boolean, required: true },
    premium: { type: Boolean, required: true },
    highlights: { type: Array, required: true },
    itemCount: { type: Number, required: true },
    star: { type: String, required: true },
    capacity: { type: String, required: true },
    feature: { type: String, required: true },
    date: { type: Number, required: true }
})



const fashionModel = mongoose.model.fashion || mongoose.model("fashion", fashionSchema)
const furnitureModel = mongoose.model.furniture || mongoose.model("furniture", furnitureSchema)
const applianceModel = mongoose.model.appliance || mongoose.model("appliance", applianceSchema)
const electronicModel = mongoose.model.electronic || mongoose.model("electronic", electronicSchema)
// const speakerModel = mongoose.model.speaker || mongoose.model("speaker", speakerSchema)


export {
    fashionModel,
    furnitureModel,
    applianceModel,
    electronicModel,
    // speakerModel
}