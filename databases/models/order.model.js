import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({

    orderNumber: { type: Number, required: true },

    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    orderItems: [{
        menuItem: { type: mongoose.Types.ObjectId, ref: 'menuItem' },
        quantity: Number,
        price: Number,
        modifiers: [{
            _id:false,
            modifier: {
                type: mongoose.Types.ObjectId,
                ref: 'modifier'
            },
            name: String,
            price: Number
        }]
    }],
    deliveryFee: { type: Number, default: 0 },

    totalPrice: Number,
    discount: Number,
    totalPriceAfterDiscount: Number,
    discountType: {
        type: String,
        enum: ['percentage', 'fixed']
    },

    deliveryAddress: {
        name: String,
        phone: String,
        city: String,
        street: String,
        building: String,
        floor: String
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,

    status: {
        type: String,
        enum: ['pending', 'accepted', 'preparing', 'outForDelivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveredAt: Date,

    cancellationReason: {
        type: String,
        default: null
    },
    cancelledBy: {
        type: String,
        enum: ['customer', 'staff', null],
        default: null
    },
    specialInstructions: {
        type: String,
        trim: true
    }

}, { timestamps: true })


orderSchema.pre(/^find/, function () {
    this.populate('orderItems.menuItem')
})

export const orderModel = mongoose.model('order', orderSchema)
