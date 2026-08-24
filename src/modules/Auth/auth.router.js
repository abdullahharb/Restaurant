
import express from 'express'
import { signUp, signIn } from './auth.controller.js'
import { validation } from '../../middleware/validation.js'
import { signInSchema, signUpSchema } from './auth.validation.js'

const authRouter = express.Router()

authRouter.post('/signup', validation(signUpSchema), signUp)
authRouter.post('/signin', validation(signInSchema), signIn)


export default authRouter
