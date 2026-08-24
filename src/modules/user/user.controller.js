import { userModel } from "../../../databases/models/user.model.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import * as factor from "../handlers/factor.handler.js";

const createUser = catchAsyncError(async (req, res, next) => {
    let isfound = await userModel.findOne({ email: req.body.email })
    if (isfound) return next(new AppError('email already exist', 409))

    let user = await new userModel(req.body)
    await user.save()
    res.json({ message: 'Success Created', result: user })
})

const getAllUsers = factor.getAll(userModel)


const getUser = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findById(req.user._id)
    if (!user) return next(new AppError('user not found', 404))
    res.json({ message: 'Success', user })
})

const updateUser = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findById(req.user._id)
    if (!user) return next(new AppError('user not found', 404))
    user = await userModel.findByIdAndUpdate(req.user._id, req.body, { returnDocument: 'after' })
    res.json({ message: 'Success Updated', user })
})

const deleteUser = catchAsyncError(async (req, res, next) => {
    const id = req.params.id || req.user._id
    let user = await userModel.findByIdAndDelete(id)
    if (!user) return next(new AppError('user not found', 404))
    res.json({ message: 'Success deleted', user })
})


const changePassword = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findByIdAndUpdate(req.user._id, {
        password: req.body.password,
        passwordChangedAt: Date.now()
    })
    if (!user) return next(new AppError('user not found', 404))
    res.json({ message: 'Success password changed', user })
})

const changeUserRole = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let user = await userModel.findByIdAndUpdate(id, { role: req.body.role }, { returnDocument: 'after' })
    if (!user) return next(new AppError('user not found', 404))
    res.json({ message: 'success changed', user })
})

export {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,

    changePassword,

    changeUserRole
}

