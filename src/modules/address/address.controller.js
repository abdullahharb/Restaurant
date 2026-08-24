import { userModel } from "../../../databases/models/user.model.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";


const addAddress = catchAsyncError(async (req, res, next) => {
    let result = await userModel.
        findByIdAndUpdate(req.user._id, { $addToSet: { addresses: req.body } }, { returnDocument: 'after' })
    if (!result) return next(new AppError('user not found', 404))
    res.status(201).json({ message: 'Success Added', result: result.addresses })
})

const removeAddress = catchAsyncError(async (req, res, next) => {
    let result = await userModel.
        findOneAndUpdate({ _id: req.user._id, "addresses._id": req.body.address },
            { $pull: { addresses: { _id: req.body.address } } }, { returnDocument: 'after' })
    if (!result) return next(new AppError('Address or user not found', 404))
    res.status(200).json({ message: 'Success Removed', result: result.addresses })
})

const getAllUserAddress = catchAsyncError(async (req, res, next) => {
    let result = await userModel.findOne({ _id: req.user._id })
    if (!result) return next(new AppError('user not found', 404))
    res.status(200).json({ message: 'Success', result: result.addresses })
})



export {
    addAddress,
    removeAddress,
    getAllUserAddress
}
