import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: [2, 'to short user name'],
        required: [true, 'user name is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, 'email must be unique'],
        required: [true, 'email required']
    },
    password: {
        type: String,
        trim: true,
        minLength: [6, 'minLength 6 characters'],
        required: [true, 'password required']
    },
    passwordChangedAt: Date,

    phone: {
        type: String,
        trim: true,
        required: [true, 'phoneNumber required']
    },
    role: {
        type: String,
        enum: ['customer', 'staff', 'manager'],
        default: 'customer'
    },
    addresses: [{
        name: String,
        phone: String,
        city: String,
        street: String,
        building: String,
        floor: String,
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


// hashpassword => create User
userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, Number(process.env.ROUND))
})

// hashpassword => update User
userSchema.pre('findOneAndUpdate', function () {
    if (this._update.password)
        this._update.password = bcrypt.hashSync(this._update.password, Number(process.env.ROUND))
})

export const userModel = mongoose.model('user', userSchema)
