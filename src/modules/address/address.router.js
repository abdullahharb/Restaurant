import express from 'express'
import * as address from './address.controller.js'
import { allowedTo, protectedRoutes } from '../Auth/auth.controller.js'
import { validation } from '../../middleware/validation.js'
import { addAddressSchema, removeAddressSchema } from './address.validation.js'
const addressRouter = express.Router()

addressRouter.route('/')
    .patch(protectedRoutes,allowedTo('customer'),validation(addAddressSchema),address.addAddress)
    .delete(protectedRoutes,allowedTo('customer'),validation(removeAddressSchema),address.removeAddress)
    .get(protectedRoutes,allowedTo('customer'),address.getAllUserAddress)


export default addressRouter
