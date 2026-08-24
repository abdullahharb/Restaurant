
import joi from 'joi';

export const createMenuItemSchema = joi.object({
    title: joi.string().min(2).max(50).required().trim(),
    price: joi.number().min(0).required(),
    description: joi.string().min(2).max(300).required().trim(),
    preparationTime: joi.number().min(1).required(),
    category: joi.string().hex().length(24).required(),
    subcategory: joi.string().hex().length(24).required()
})

export const updateMenuItemSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    title: joi.string().min(2).max(50).trim(),
    price: joi.number().min(0),
    description: joi.string().min(2).max(300).trim(),
    preparationTime: joi.number().min(1),
    category: joi.string().hex().length(24),
    subcategory: joi.string().hex().length(24)
})

export const DeleteMenuItemSchema = joi.object({
    id: joi.string().hex().length(24).required()
})
