import {Request, Response} from "express";
import {ThrowError} from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import {IProduct} from "../models/IProduct";
import ProductCollection from "../schemas/ProductSchema";
import {APP_CONSTANTS} from "../contants";
import mongoose from "mongoose";
import productSchema from "../schemas/ProductSchema";

/**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @params : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */

export const createProduct = async (request: Request, response: Response) => {
    try {
        const {title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            // check if the same product exists
            const theProduct: IProduct | undefined | null = await ProductCollection.findOne({title: title});
            if (theProduct) {
                return ThrowError(response, 401, "The Product is already exists!");
            }
            const newProduct: IProduct = {
                title: title,
                description: description,
                imageUrl: imageUrl,
                brand: brand,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subCategoryObj: subCategoryId,
                userObj: theUser._id
            };
            const createdProduct = await new ProductCollection(newProduct).save();
            if (createdProduct) {
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: createdProduct,
                    msg: "Product is Created Successfully!"
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Update a Product
 * @url : http://localhost:9000/api/products/:productId
 * @params : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : PUT
 * @access : PRIVATE
 */
export const updateProduct = async (request: Request, response: Response) => {
    try {
        const {title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId} = request.body;
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            // check if the same product exists
            const theProduct: IProduct | undefined | null = await ProductCollection.findById(mongoProductId);
            if (!theProduct) {
                return ThrowError(response, 404, "The Product is not exists!");
            }
            const newProduct: IProduct = {
                title: title,
                description: description,
                imageUrl: imageUrl,
                brand: brand,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subCategoryObj: subCategoryId,
                userObj: theUser._id
            };
            const updatedProduct = await ProductCollection.findByIdAndUpdate(mongoProductId, {
                $set: newProduct
            }, {new: true});
            if (updatedProduct) {
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: updatedProduct,
                    msg: "Product is Updated Successfully!"
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Get all Products
 * @url : http://localhost:9000/api/products/
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllProducts = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theProducts: IProduct[] | any = await ProductCollection.find().populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                msg: "",
                data: theProducts
            })
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Get a Product
 * @url : http://localhost:9000/api/products/:productId
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getProduct = async (request: Request, response: Response) => {
    try {
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theProduct: IProduct | any = await ProductCollection.findById(mongoProductId).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if (!theProduct) {
                return ThrowError(response, 404, "The product is not found");
            }
            return response.status(200).json({
                msg: "",
                data: theProduct,
                status: APP_CONSTANTS.SUCCESS
            })
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Delete a Product
 * @url : http://localhost:9000/api/products/:productId
 * @params : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
export const deleteProduct = async (request: Request, response: Response) => {
    try {
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theProduct: IProduct | any = await ProductCollection.findById(mongoProductId).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if (!theProduct) {
                return ThrowError(response, 404, "The product is not found");
            }

            const deletedProduct = await ProductCollection.findByIdAndDelete(mongoProductId);
            if (deletedProduct) {
                return response.status(200).json({
                    msg: "The Product is deleted!",
                    data: deletedProduct,
                    status: APP_CONSTANTS.SUCCESS
                })
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};


/**
 * @usage : Get all products with category Id
 * @url : http://localhost:9000/api/products/categories/:categoryId
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllProductsWithCategoryId = async (request: Request, response: Response) => {
    try {
        const {categoryId} = request.params;
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const products: IProduct[] | any = await ProductCollection.find({categoryObj: categoryId}).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: products,
                msg: ""
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};
