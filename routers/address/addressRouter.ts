import {Router, Request, Response} from 'express';
import {tokenVerifier} from "../../middlewares/tokenVerifier";
import * as addressController from "../../controllers/addressController";
import {body} from 'express-validator';
import {validateForm} from "../../middlewares/validateForm";

const addressRouter: Router = Router();

/**
 * @usage : Create New Address
 * @url : http://localhost:9000/api/addresses/new
 * @params : mobile,flat,landmark,street,city,state,country,pinCode
 * @method : POST
 * @access : PRIVATE
 */
addressRouter.post("/new", [
    body('mobile').not().isEmpty().withMessage("mobile is required"),
    body('flat').not().isEmpty().withMessage("flat is required"),
    body('landmark').not().isEmpty().withMessage("landmark is required"),
    body('street').not().isEmpty().withMessage("street is required"),
    body('city').not().isEmpty().withMessage("city is required"),
    body('state').not().isEmpty().withMessage("state is required"),
    body('country').not().isEmpty().withMessage("country is required"),
    body('pinCode').not().isEmpty().withMessage("pinCode is required"),
], tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await addressController.createNewAddress(request, response);
});

/**
 * @usage : Update Address
 * @url : http://localhost:9000/api/addresses/:addressId
 * @params : mobile,flat,landmark,street,city,state,country,pinCode
 * @method : PUT
 * @access : PRIVATE
 */
addressRouter.put("/:addressId", [
    body('mobile').not().isEmpty().withMessage("mobile is required"),
    body('flat').not().isEmpty().withMessage("flat is required"),
    body('landmark').not().isEmpty().withMessage("landmark is required"),
    body('street').not().isEmpty().withMessage("street is required"),
    body('city').not().isEmpty().withMessage("city is required"),
    body('state').not().isEmpty().withMessage("state is required"),
    body('country').not().isEmpty().withMessage("country is required"),
    body('pinCode').not().isEmpty().withMessage("pinCode is required"),
], tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await addressController.updateAddress(request, response);
});

/**
 * @usage : Get Address
 * @url : http://localhost:9000/api/addresses/me
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
addressRouter.get("/me", tokenVerifier, async (request: Request, response: Response) => {
    await addressController.getAddress(request, response);
});

/**
 * @usage : Delete Address
 * @url : http://localhost:9000/api/addresses/:addressId
 * @params : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
addressRouter.delete("/:addressId", tokenVerifier, async (request: Request, response: Response) => {
    await addressController.deleteAddress(request, response);
});

export default addressRouter;