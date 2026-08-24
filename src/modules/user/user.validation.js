import joi from 'joi'

const PhoneRegex = /^01[0125][0-9]{8}$/

export const createUserSchema = joi.object({
    name: joi.string().min(2).max(30).required().trim(),
    email: joi.string().email().required().trim().lowercase(),
    password: joi.string().min(6).required(),
    phone: joi.string().pattern(PhoneRegex).required(),
    role: joi.string().valid('manager', 'staff', 'customer').required(),
})

export const updateUserSchema = joi.object({
    name: joi.string().min(2).max(30).trim(),
    email: joi.string().email().trim().lowercase(),
    phone: joi.string().pattern(PhoneRegex),
})

export const deleteUserByIdSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

export const changePasswordSchema = joi.object({
    password: joi.string().min(6).required(),
})

export const changeUserRoleSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    role: joi.string().valid('customer', 'staff', 'manager').required(),
})
