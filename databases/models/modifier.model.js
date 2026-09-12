import mongoose from 'mongoose'

const modifierSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, 'modifier name must be unique'],
        required: [true, 'modifier name required']
    },
    price: {
        type: Number,
        default: 0,
        min: 0,
        required: [true, 'modifier price required']
    },
    menuItem: {
        type: mongoose.Types.ObjectId,
        ref: 'menuItem'
    }

}, { timestamps: true });


export const modifierModel = mongoose.model('modifier', modifierSchema)
