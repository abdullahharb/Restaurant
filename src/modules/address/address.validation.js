
import joi from 'joi'

const PhoneRegex = /^01[0125][0-9]{8}$/

export const addAddressSchema = joi.object({
    name: joi.string().min(2).max(50).trim().required(),
    phone: joi.string().pattern(PhoneRegex).required(),
    city: joi.string().min(2).max(50).trim().required(),
    street: joi.string().min(2).max(100).trim().required(),
    building: joi.string().trim().required(),
    floor: joi.string().trim()
})

export const removeAddressSchema = joi.object({
    address: joi.string().hex().length(24).required()
})
