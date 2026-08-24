import { cartModel } from "../../../databases/models/cart.model.js"
import { couponModel } from "../../../databases/models/coupon.model.js"
import { orderModel } from "../../../databases/models/order.model.js"
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import crypto from "crypto"

const createPayment = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) return next(new AppError('Cart not found, please add items first', 404))
    let totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice
    let response = await fetch(`${process.env.PAYMOB_BASE_URL}/v1/intention/`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: totalOrderPrice * 100,
            currency: 'EGP',
            payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],
            special_reference: req.user._id.toString(),
            billing_data: {
                first_name: req.user.name,
                last_name: req.user.name,
                email: req.user.email,
                phone_number: req.body.deliveryAddress.phone,
                apartment: 'NA',
                floor: req.body.deliveryAddress.floor || 'NA',
                building: req.body.deliveryAddress.building,
                street: req.body.deliveryAddress.street,
                shipping_method: 'NA',
                postal_code: 'NA',
                city: req.body.deliveryAddress.city,
                state: 'NA',
                country: 'EG'
            },
            notification_url: `${process.env.BASE_URL}/api/v1/payment/webhook`,
            redirection_url: `${process.env.BASE_URL}/api/v1/payment/success`
        })
    })
    let data = await response.json()
    if (!response.ok) return next(new AppError(data.detail || 'Failed to create payment', 400))
    let checkoutUrl = `${process.env.PAYMOB_BASE_URL}/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`
    return res.status(200).json({ message: 'success', checkoutUrl })
})
const paymentWebhook = catchAsyncError(async (req, res) => {
    let { obj } = req.body
    let { amount_cents, created_at, currency, error_occured, has_parent_transaction, id, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, is_standalone_payment, is_voided, owner, pending, success, order: { id: orderId, merchant_order_id }, source_data: { pan, sub_type, type } } = obj
    let fields = [amount_cents, created_at, currency, error_occured, has_parent_transaction, id, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, is_standalone_payment, is_voided, orderId, owner, pending, pan, sub_type, type, success]
    let hmac = crypto.createHmac('sha512', process.env.PAYMOB_HMAC_SECRET).update(fields.join('')).digest('hex')
    if (hmac !== req.query.hmac) return res.status(401).json({ message: 'Invalid HMAC' })
    if (success === true && pending === false) {
        let userId = merchant_order_id
        let cart = await cartModel.findOne({ user: userId })
        if (cart) {
            let coupon = await couponModel.findById(cart.coupon)
            await orderModel.create({
                orderNumber: parseInt(Date.now().toString().slice(-4)),
                user: userId,
                orderItems: cart.cartItems,
                totalPrice: cart.totalPrice,
                discount: cart.discount,
                discountType: cart.discountType,
                totalPriceAfterDiscount: cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice,
                deliveryAddress: req.body.billing_data,
                paymentMethod: 'card',
                isPaid: true,
                paidAt: Date.now()
            })
            if (coupon) {
                coupon.usageCount += 1
                await coupon.save()
            }
            cart.cartItems = []
            cart.totalPrice = 0
            cart.totalPriceAfterDiscount = undefined
            cart.discount = undefined
            cart.discountType = undefined
            cart.coupon = undefined
            await cart.save()
        }
    }
    return res.status(200).json({ received: true })
})


const paymentSuccess = catchAsyncError(async (req, res, next) => {
    res.status(200).json({ message: 'Payment completed, waiting for confirmation' })
})

const paymentCancel = catchAsyncError(async (req, res, next) => {
    res.status(200).json({ message: 'Payment canceled' })
})

export {
    createPayment,
    paymentWebhook,
    paymentSuccess,
    paymentCancel
}
