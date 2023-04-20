import {Router, Request, Response} from 'express';
import {body} from "express-validator";
import {tokenVerifier} from "../../middlewares/tokenVerifier";
import {validateForm} from "../../middlewares/validateForm";
import * as orderController from "../../controllers/orderController";

const ordersRouter: Router = Router();

/**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @params : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */
ordersRouter.post("/place", [
    body('products').not().isEmpty().withMessage("products is required"),
    body('total').not().isEmpty().withMessage("total is required"),
    body('tax').not().isEmpty().withMessage("tax is required"),
    body('grandTotal').not().isEmpty().withMessage("grandTotal is required"),
    body('paymentType').not().isEmpty().withMessage("paymentType is required"),
], tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await orderController.placeOrder(request, response);
});

/**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
ordersRouter.get("/all", tokenVerifier, async (request: Request, response: Response) => {
    await orderController.getAllOrders(request, response);
});

/**
 * @usage : get my orders
 * @url : http://localhost:9000/api/orders/me
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
ordersRouter.get("/me", tokenVerifier, async (request: Request, response: Response) => {
    await orderController.getMyOrders(request, response);
});

/**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @params : orderStatus
 * @method : POST
 * @access : PRIVATE
 */
ordersRouter.post("/:orderId", [
    body('orderStatus').not().isEmpty().withMessage("orderStatus is required"),
], tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await orderController.updateOrderStatus(request, response);
});

export default ordersRouter;