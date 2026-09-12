import mongoose from 'mongoose'

const cartSchema = mongoose.Schema({

    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    cartItems: [{
        menuItem: { type: mongoose.Types.ObjectId, ref: 'menuItem' },
        quantity: { type: Number, default: 1 },
        price: Number,
        modifiers: [{
            _id: false,
            modifier: {
                type: mongoose.Types.ObjectId,
                ref: 'modifier'
            },
            name: String,
            price: Number
        }]
    }],
    totalPrice: Number,
    discount: Number,
    totalPriceAfterDiscount: Number,
    discountType: {
        type: String,
        enum: ['percentage', 'fixed']
    },
    coupon: { type: mongoose.Types.ObjectId, ref: 'coupon' }

}, { timestamps: true })


export const cartModel = mongoose.model('cart', cartSchema)
