import mongoose from "mongoose"

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name is unique'],
        trim: true,
        required: [true, 'name category is required'],
        minLength: [2, 'name is small']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    image: String

}, { timestamps: true })


categorySchema.post('init', (doc) => {
    doc.image = process.env.BASE_URL + "/category/" + doc.image
})

export const categoryModel = mongoose.model('category', categorySchema)
