
import joi from 'joi'

const objectId = joi.string().hex().length(24)

export const addToCartSchema = joi.object({
    menuItem: objectId.required(),
    quantity: joi.number().integer().min(1),
    modifiers: joi.array().items(objectId)
})

export const updateQuantitySchema = joi.object({
    menuItem: objectId.required(),
    quantity: joi.number().integer().min(1).required(),
    modifiers: joi.array().items(objectId)
})

export const applyCouponSchema = joi.object({
    code: joi.string().trim().uppercase().required()
})

export const removeFromCartSchema = joi.object({
    id: objectId.required()
})
