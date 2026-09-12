import mongoose from 'mongoose'

const subcategorySchema = mongoose.Schema({

    name: {
        type: String,
        unique: [true, 'name is unique'],
        trim: true,
        minLength: [2, 'name is small'],
        required: [true, 'name subcategory is required']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    image: String,

    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: [true, 'CategoryId is required']
    }

}, { timestamps: true })


subcategorySchema.post('init', (doc) => {
    doc.image = process.env.BASE_URL + "/subcategory/" + doc.image
})

export const subcategoryModel = mongoose.model('subcategory', subcategorySchema)
