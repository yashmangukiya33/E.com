import {Request, Response} from "express";
import {ThrowError} from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import {ICart} from "../models/ICart";
import CartCollection from "../schemas/CartSchema";
import {IOrder} from "../models/IOrder";
import OrderCollection from "../schemas/OrderSchema";
import mongoose from "mongoose";
import {APP_CONSTANTS} from "../contants";
import OrderSchema from "../schemas/OrderSchema";

/**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @params : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */
export const placeOrder = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const {products, total, tax, grandTotal, paymentType} = request.body;
            const newOrder: IOrder = {
                products: products,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                orderBy: theUser._id,
                paymentType: paymentType
            };
            const theOrder = await new OrderCollection(newOrder).save();
            if (!theOrder) {
                return response.status(400).json({msg: 'Order Creation is failed'});
            }
            const actualOrder = await OrderCollection.findById(new mongoose.Types.ObjectId(theOrder._id)).populate({
                path: 'userObj',
                strictPopulate: false
            })
            return response.status(200).json(
                {
                    msg: 'Order Creation is Success',
                    data: actualOrder,
                    status: APP_CONSTANTS.SUCCESS
                });
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllOrders = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const orders: IOrder[] | any = await OrderCollection.find().populate({
                path: 'products.product',
                strictPopulate: false
            }).populate({
                path: 'userObj',
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: orders,
                msg: ""
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : get my orders
 * @url : http://localhost:9000/api/orders/me
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getMyOrders = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const orders: IOrder[] | any = await OrderCollection.find({orderBy: new mongoose.Types.ObjectId(theUser._id)}).populate({
                path: 'products.product',
                strictPopulate: false
            }).populate({
                path: 'userObj',
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: orders,
                msg: ""
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @params : orderStatus
 * @method : POST
 * @access : PRIVATE
 */
export const updateOrderStatus = async (request: Request, response: Response) => {
    try {
        const {orderStatus} = request.body;
        const {orderId} = request.params;
        const mongoOrderId = new mongoose.Types.ObjectId(orderId);
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theOrder: IOrder | any = await OrderCollection.findById(mongoOrderId);
            if (!theOrder) {
                return ThrowError(response, 401, "No Order found");
            }
            theOrder.orderStatus = orderStatus;
            await theOrder.save();
            const theActualOrder = await OrderCollection.findById(mongoOrderId).populate({
                path: 'products.product',
                strictPopulate: false
            }).populate({
                path: 'orderBy',
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: theActualOrder,
                msg: "Order Status is Updated!"
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};