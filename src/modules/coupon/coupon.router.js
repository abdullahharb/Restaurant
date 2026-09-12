import express from 'express'
import * as coupon from './coupon.controller.js'
import { validation } from '../../middleware/validation.js'
import { getOrDeleteCouponSchema, createCouponSchema, updateCouponSchema } from './coupon.validation.js'
import { allowedTo, protectedRoutes } from '../Auth/auth.controller.js'
const couponRouter = express.Router()

couponRouter.route('/')
    .post(protectedRoutes, allowedTo('manager'), validation(createCouponSchema), coupon.createCoupon)
    .get(coupon.getAllCoupons)

couponRouter.route('/:id')
    .get(protectedRoutes, allowedTo('manager'), validation(getOrDeleteCouponSchema), coupon.getCoupon)
    .put(protectedRoutes, allowedTo('manager'), validation(updateCouponSchema), coupon.updateCoupon)
    .delete(protectedRoutes, allowedTo('manager'), validation(getOrDeleteCouponSchema), coupon.deleteCoupon)

export default couponRouter
