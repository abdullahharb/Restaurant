
import joi from 'joi'

export const createCouponSchema = joi.object({
    code: joi.string().trim().uppercase().required(),
    discountType: joi.string().valid('percentage', 'fixed'),
    discount: joi.number().min(0).required(),
    expires: joi.date().greater('now').required(),
    usageLimit: joi.number().integer().min(1).allow(null),
})

export const updateCouponSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    code: joi.string().trim().uppercase(),
    discountType: joi.string().valid('percentage', 'fixed'),
    discount: joi.number().min(0),
    expires: joi.date().greater('now'),
    usageLimit: joi.number().integer().min(1).allow(null),
    isActive: joi.boolean()
})

export const getOrDeleteCouponSchema = joi.object({
    id: joi.string().hex().length(24).required()
})
