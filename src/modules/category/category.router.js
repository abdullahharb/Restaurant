import express from 'express'
import *as category from './category.controller.js'
import subCategoryRouter from '../subcategory/subcategory.router.js'
import { validation } from '../../middleware/validation.js'
import { createCategorySchema, getOrDeleteCategorySchema, updateCategorySchema } from './category.validation.js'
import { uploadSingleFile } from '../../middleware/fileUpload.js'
import { allowedTo, protectedRoutes } from '../Auth/auth.controller.js'

const categoryRouter = express.Router()

categoryRouter.use('/:categoryId/subcategories', subCategoryRouter)

categoryRouter.route('/')
    .post(protectedRoutes, allowedTo('manager', 'staff'), uploadSingleFile('image', 'category'), validation(createCategorySchema), category.createCategory)
    .get(category.getAllCategories)

categoryRouter.route('/:id')
    .get(validation(getOrDeleteCategorySchema), category.getCategory)
    .put(protectedRoutes, allowedTo('manager', 'staff'), uploadSingleFile('image', 'category'), validation(updateCategorySchema), category.updateCategory)
    .delete(protectedRoutes, allowedTo('manager', 'staff'), validation(getOrDeleteCategorySchema), category.deleteCategory)

export default categoryRouter
