import joi from 'joi'

const PhoneRegex = /^01[0125][0-9]{8}$/

export const signUpSchema = joi.object({
    name: joi.string().min(2).max(30).required().trim(),
    email: joi.string().email().required().trim().lowercase(),
    password: joi.string().min(6).required(),
    phone: joi.string().pattern(PhoneRegex).required(),
})

export const signInSchema = joi.object({
    email: joi.string().email().required().trim().lowercase(),
    password: joi.string().required()
})
