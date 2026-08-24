
import joi from 'joi';

export const createCategorySchema = joi.object({
    name: joi.string().min(2).max(20).required().trim()
})

export const updateCategorySchema = joi.object({
    id: joi.string().hex().length(24).required(),
    name: joi.string().min(2).max(20)
})

export const getOrDeleteCategorySchema = joi.object({
    id: joi.string().hex().length(24).required()
})
