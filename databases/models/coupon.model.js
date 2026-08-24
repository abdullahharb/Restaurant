import mongoose from 'mongoose'

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        trim: true,
        uppercase: true,
        unique: [true, 'code coupon unique'],
        required: [true, 'code coupon required']
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage',
        required: [true, 'discount type required']
    },
    discount: {
        type: Number,
        min: [0, 'discount must be positive'],
        required: [true, 'discount coupon required']
    },
    expires: {
        type: Date,
        required: [true, 'coupon expires date required']
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

export const couponModel = mongoose.model('coupon', couponSchema)
