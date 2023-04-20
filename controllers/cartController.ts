import {Request, Response} from "express";
import {ThrowError} from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import CartCollection from "../schemas/CartSchema";
import {ICart} from "../models/ICart";
import mongoose from "mongoose";
import {APP_CONSTANTS} from "../contants";

/**
 * @usage : create a Cart
 * @url : http://localhost:9000/api/carts/
 * @params :products[{product, count,price}],total,tax,grandTotal
 * @method : POST
 * @access : PRIVATE
 */
export const createCart = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const {products, total, tax, grandTotal} = request.body;
            // check if user already have a cart
            const cart = await CartCollection.findOne({userObj: theUser._id});
            if (cart) {
                await CartCollection.findOneAndDelete({userObj: theUser._id});
            }
            const newCart: ICart = {
                products: products,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                userObj: theUser._id
            };
            const theCart = await new CartCollection(newCart).save();
            if (!theCart) {
                return response.status(400).json({msg: 'Cart Creation is failed'});
            }
            const actualCart = await CartCollection.findById(new mongoose.Types.ObjectId(theCart._id)).populate({
                path: 'userObj',
                strictPopulate: false
            })
            return response.status(200).json(
                {
                    msg: 'Cart Creation is Success',
                    data: actualCart,
                    status: APP_CONSTANTS.SUCCESS
                });
        }
    } catch (error) {
        console.log(error);
        return ThrowError(response);
    }
};

/**
 * @usage : get Cart Info
 * @url : http://localhost:9000/api/carts/me
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getCartInfo = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theCart: any = await CartCollection.find({userObj: new mongoose.Types.ObjectId(theUser._id)}).populate({
                path: 'products.product',
                strictPopulate: false
            }).populate({
                path: 'userObj',
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                msg: "",
                data: theCart
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};