import express from 'express'
import * as modifier from './modifier.controller.js'
import { allowedTo, protectedRoutes } from '../Auth/auth.controller.js'
import { validation } from '../../middleware/validation.js'
import { createModifierSchema, deleteModifierSchema, updateModifierSchema } from './modifier.validation.js'

const modifierRouter = express.Router()

modifierRouter.route('/')
    .post(protectedRoutes, allowedTo('manager', 'staff'),validation(createModifierSchema), modifier.createModifier)
    .get(modifier.getAllModifiers)

modifierRouter.route('/:id')
    .get(modifier.getModifier)
    .put(protectedRoutes, allowedTo('manager', 'staff'),validation(updateModifierSchema), modifier.updateModifier)
    .delete(protectedRoutes, allowedTo('manager', 'staff'),validation(deleteModifierSchema), modifier.deleteModifier)

export default modifierRouter
