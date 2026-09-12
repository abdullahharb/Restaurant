import { cartModel } from "../../../databases/models/cart.model.js";
import { couponModel } from "../../../databases/models/coupon.model.js";
import { menuItemModel } from "../../../databases/models/menuItem.model.js";
import { modifierModel } from "../../../databases/models/modifier.model.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { AppError } from "../../utils/AppError.js";

function calcTotalPrice(isCartExist) {
    let totalPrice = 0
    isCartExist.cartItems.forEach(elm => {
        let modifierPrice = 0
        elm.modifiers.forEach(modifier => {
            modifierPrice += modifier.price
        })
        totalPrice += elm.quantity * (elm.price + modifierPrice)
    })
    isCartExist.totalPrice = totalPrice
}

function calcTotalPriceAfterDiscount(cart) {
    if (!cart.totalPrice || !cart.discount) {
        cart.totalPriceAfterDiscount = undefined
        return
    }
    if (cart.discountType === 'percentage') {
        cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount / 100)
    } else {
        cart.totalPriceAfterDiscount = cart.totalPrice - cart.discount
    }
}


const addToCart = catchAsyncError(async (req, res, next) => {

    let menuItem = await menuItemModel.findById(req.body.menuItem)
    if (!menuItem) return next(new AppError('menuItem not found', 404))
    req.body.price = menuItem.price

    if (req.body.modifiers?.length) {
        let modifiers = await modifierModel.find({ _id: { $in: req.body.modifiers } })

        if (modifiers.length !== req.body.modifiers.length) return next(new AppError('some modifiers not found', 404))

        req.body.modifiers = modifiers.map(elm => ({ modifier: elm._id, name: elm.name, price: elm.price }))
    }

    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) cart = new cartModel({ user: req.user._id, cartItems: [] })

    let item = cart.cartItems.find(elm =>
        elm.menuItem.toString() == req.body.menuItem &&
        JSON.stringify(elm.modifiers.map(x => x.modifier)) == JSON.stringify((req.body.modifiers || []).map(x => x.modifier))
    )

    if (item) {
        item.quantity += 1
    } else {
        cart.cartItems.push(req.body)
    }
    calcTotalPrice(cart)
    calcTotalPriceAfterDiscount(cart)

    await cart.save()
    res.status(201).json({ message: 'success added', cart })
})

const getLogedUserCart = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findOne({ user: req.user._id }).populate('cartItems.menuItem')
    if (!cart) return next(new AppError('Your cart is empty, Please add your cart.', 404))
    calcTotalPrice(cart)
    calcTotalPriceAfterDiscount(cart)
    res.json({ message: 'success', cart })
})

const updateQuantity = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) return next(new AppError('cart not found', 404))

    let item = cart.cartItems.find(elm => elm.menuItem == req.body.menuItem &&
        JSON.stringify(elm.modifiers.map(x => x.modifier)) == JSON.stringify(req.body.modifiers || [])
    )
    if (!item) return next(new AppError('item not found in cart', 404))
    item.quantity = req.body.quantity || 1

    calcTotalPrice(cart)
    calcTotalPriceAfterDiscount(cart)
    await cart.save()
    res.status(201).json({ message: 'success update quantity', cart })
})

const removeFromCart = catchAsyncError(async (req, res, next) => {

    let cart = await cartModel.findOneAndUpdate({ user: req.user._id, "cartItems._id": req.params.id, },
        { $pull: { cartItems: { _id: req.params.id } } }, { returnDocument: 'after' })

    if (!cart) return next(new AppError('cart or user not found', 404))

    calcTotalPrice(cart)
    calcTotalPriceAfterDiscount(cart)
    await cart.save()
    res.json({ message: 'success removed', cart })
})

const applyCoupon = catchAsyncError(async (req, res, next) => {
    let coupon = await couponModel.findOne({ code: req.body.code, isActive: true, expires: { $gt: Date.now() } })
    if (!coupon) return next(new AppError('Invalid, or expired coupon', 400))

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
        return next(new AppError('Coupon usage limit has been reached', 400))

    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) return next(new AppError('Cart not found, please add items first', 404))

    let discount = coupon.discountType === 'percentage' ? (cart.totalPrice * coupon.discount) / 100
        : coupon.discount

    if (discount >= cart.totalPrice)
        return next(new AppError('Discount cannot be greater than cart total price', 400))

    cart.discount = coupon.discount
    cart.discountType = coupon.discountType
    cart.totalPriceAfterDiscount = cart.totalPrice - discount
    cart.coupon = coupon._id

    await cart.save()
    return res.status(200).json({ message: 'success, coupon applied', cart })
})

const removeCoupon = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) return next(new AppError('Cart not found, please add items first', 404))
    cart.discount = undefined
    cart.discountType = undefined
    cart.totalPriceAfterDiscount = undefined

    await cart.save()
    return res.status(200).json({ message: 'success, removed Coupon', cart })
})

export {
    addToCart,
    getLogedUserCart,
    updateQuantity,
    removeFromCart,

    applyCoupon,
    removeCoupon
}
