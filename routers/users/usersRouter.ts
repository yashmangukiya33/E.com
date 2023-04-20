import {Router, Request, Response, raw} from 'express';
import {tokenVerifier} from "../../middlewares/tokenVerifier";
import {validateForm} from "../../middlewares/validateForm";
import * as userController from "../../controllers/userController";
import {body} from "express-validator";

const usersRouter: Router = Router();

/**
 * @usage : Register a User
 * @url : http://localhost:9000/api/users/register
 * @params : username , email , password
 * @method : POST
 * @access : PUBLIC
 */
usersRouter.post("/register", [
    body('username').not().isEmpty().withMessage("Username is required"),
    body('email').isEmail().withMessage("valid email is required"),
    body('password').isLength({min: 5}).withMessage("Strong password is required"),
    // body('password').isStrongPassword().withMessage("Strong password is required"),
], validateForm, async (request: Request, response: Response) => {
    await userController.registerUser(request, response);
});


/**
 * @usage : Login a User
 * @url : http://localhost:9000/api/users/login
 * @params : email , password
 * @method : POST
 * @access : PUBLIC
 */
usersRouter.post("/login", [
    body('email').isEmail().withMessage("valid email is required"),
    body('password').isStrongPassword().withMessage("Strong password is required"),
], validateForm, async (request: Request, response: Response) => {
    await userController.loginUser(request, response);
});


/**
 *  @usage : get users Data
 *  @url : http://localhost:9000/api/users/me
 *  @method : GET
 *  @param : no-params
 *  @access : PRIVATE
 */
usersRouter.get("/me", tokenVerifier, async (request: Request, response: Response) => {
    await userController.getUsersData(request, response);
});

/**
 * @usage : update profile Picture
 * @url : http://localhost:9000/api/users/profile
 * @params : imageUrl
 * @method : POST
 * @access : PRIVATE
 */
usersRouter.post("/profile", [
    body('imageUrl').not().isEmpty().withMessage("imageUrl is required"),
], tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await userController.updateProfilePicture(request, response);
});

/**
 * @usage : change the password
 * @url : http://localhost:9000/api/users/change-password
 * @params : password
 * @method : POST
 * @access : PRIVATE
 */
usersRouter.post("/change-password", [
    body('password').isStrongPassword().withMessage("Strong Password is required"),
], tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await userController.changePassword(request, response);
});


export default usersRouter;