
import express from 'express'
import * as subCategory from './subcategory.controller.js'
import { uploadSingleFile } from '../../middleware/fileUpload.js'
import { allowedTo, protectedRoutes } from '../Auth/auth.controller.js'
const subCategoryRouter = express.Router({ mergeParams: true })

subCategoryRouter.route('/')
    .post(uploadSingleFile('image', 'subcategory'), protectedRoutes,allowedTo('manager','staff'),subCategory.createSubCategory)
    .get(subCategory.getAllSubCategories)

subCategoryRouter.route('/:id')
    .get(subCategory.getSubCategory)
    .put(uploadSingleFile('image', 'subcategory'), protectedRoutes,allowedTo('manager','staff'),subCategory.updateSubCategory)
    .delete(protectedRoutes,allowedTo('manager','staff'),subCategory.deleteSubCtegory)

export default subCategoryRouter
