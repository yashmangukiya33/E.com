import {Router, Request, Response} from 'express';
import {body} from "express-validator";
import {tokenVerifier} from "../../middlewares/tokenVerifier";
import {validateForm} from "../../middlewares/validateForm";
import * as categoryController from "../../controllers/categoryController";

const categoriesRouter: Router = Router();

/**
 * @usage : Create a Category
 * @url : http://localhost:9000/api/categories/
 * @params : name, description
 * @method : POST
 * @access : PRIVATE
 */
categoriesRouter.post("/", [
    body('name').not().isEmpty().withMessage("Name is required"),
    body('description').not().isEmpty().withMessage("Description is required"),
], tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await categoryController.createCategory(request, response);
});

/**
 * @usage : Create a Sub Category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @params : name, description
 * @method : POST
 * @access : PRIVATE
 */
categoriesRouter.post("/:categoryId", [
    body('name').not().isEmpty().withMessage("Name is required"),
    body('description').not().isEmpty().withMessage("Description is required"),
], tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await categoryController.createSubCategory(request, response);
});

/**
 * @usage : Get all categories
 * @url : http://localhost:9000/api/categories/
 * @params : no-params
 * @method : GET
 * @access : PUBLIC
 */
categoriesRouter.get("/", async (request: Request, response: Response) => {
    await categoryController.getAllCategories(request, response);
});

export default categoriesRouter;