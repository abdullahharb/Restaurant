import { globalErrorMiddleware } from "../middleware/globalErrorMiddleware.js"
import { AppError } from "../utils/AppError.js"
import categoryRouter from "./category/category.router.js"
import subCategoryRouter from "./subcategory/subcategory.router.js"
import modifierRouter from "./modifier/modifier.router.js"
import menuItemRouter from "./menuItem/menuItem.router.js"
import userRouter from "./user/user.router.js"
import authRouter from "./Auth/auth.router.js"
import couponRouter from "./coupon/coupon.router.js"
import addressRouter from "./address/address.router.js"
import cartRouter from "./cart/cart.router.js"
import orderRouter from "./order/order.router.js"

import paymentRouter from "./payment/payment.router.js"




export function init(app) {

    app.use('/api/v1/categories', categoryRouter)
    app.use('/api/v1/subcategories', subCategoryRouter)
    app.use('/api/v1/modifiers', modifierRouter)
    app.use('/api/v1/menuItems', menuItemRouter)
    app.use('/api/v1/users', userRouter)
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/coupons', couponRouter)
    app.use('/api/v1/addresses', addressRouter)
    app.use('/api/v1/carts', cartRouter)
    app.use('/api/v1/orders', orderRouter)

    app.use('/api/v1/payment', paymentRouter)


    app.get('/', (req, res) => res.json({ message: 'Welcome User In The Restaurant' }))

    app.use((req, res, next) => next(new AppError(`cant find this route: ${req.originalUrl}`, 404)))

    app.use(globalErrorMiddleware)

}